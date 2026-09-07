using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using System.Text;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

[assembly: SupportedOSPlatform("browser")]

public static partial class BrowserHost
{
    private static readonly List<MetadataReference> References = [];
    [JSImport("write", "consoleBridge")]
    internal static partial void Write(string text);
    [JSImport("read", "consoleBridge")]
    internal static partial string Read(string kind);
    [JSImport("clear", "consoleBridge")]
    internal static partial void Clear();

    public static void Main() { }

    [JSExport]
    public static void AddReference(byte[] bytes) => References.Add(MetadataReference.CreateFromImage(bytes));

    [JSExport]
    public static async Task<string> Run(string source)
    {
        Console.SetOut(new BrowserWriter());
        Console.SetError(new BrowserWriter());
        try
        {
            var tree = CSharpSyntaxTree.ParseText(source, new CSharpParseOptions(LanguageVersion.Latest), "Program.cs");
            var imports = CSharpSyntaxTree.ParseText("global using System; global using System.Collections.Generic; global using System.IO; global using System.Linq; global using System.Threading; global using System.Threading.Tasks;", path: "ImplicitUsings.g.cs");
            var compilation = CSharpCompilation.Create("Student_" + Guid.NewGuid().ToString("N"), [tree, imports], References,
                new CSharpCompilationOptions(OutputKind.ConsoleApplication, concurrentBuild: false,
                    optimizationLevel: OptimizationLevel.Debug));
            var errors = compilation.GetDiagnostics().Where(d => d.Severity == DiagnosticSeverity.Error).ToArray();
            if (errors.Length > 0) return Diagnostics(errors);
            // Rewrite only methods resolved to System.Console, including aliases and using static.
            // User-defined Console classes and strings/comments are left intact.
            var root = new ConsoleInputRewriter(compilation.GetSemanticModel(tree)).Visit(tree.GetRoot())!;
            compilation = compilation.ReplaceSyntaxTree(tree, tree.WithRootAndOptions(root, tree.Options));
            using var assemblyBytes = new MemoryStream();
            var emitted = compilation.Emit(assemblyBytes);
            if (!emitted.Success) return Diagnostics(emitted.Diagnostics);
            var assembly = Assembly.Load(assemblyBytes.ToArray());
            var entry = assembly.EntryPoint ?? throw new InvalidOperationException("No Main method was found.");
            // Async Main has a compiler-generated synchronous wrapper that blocks on a
            // monitor. Invoke the actual Task-returning method in WASM instead.
            var entrySymbol = compilation.GetEntryPoint(default);
            if (entrySymbol is not null)
                entry = entry.DeclaringType!.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
                    .FirstOrDefault(method => method.Name == entrySymbol.MetadataName
                        && method.GetParameters().Length == entrySymbol.Parameters.Length
                        && (method.GetParameters().Length == 0 || method.GetParameters()[0].ParameterType == typeof(string[]))) ?? entry;
            var returned = entry.Invoke(null, entry.GetParameters().Length == 0 ? null : [Array.Empty<string>()]);
            if (returned is Task task)
            {
                await task;
                returned = task.GetType().GetProperty("Result")?.GetValue(task);
            }
            var exitCode = returned is int code ? code : 0;
            return JsonSerializer.Serialize(new { success = exitCode == 0, error = exitCode == 0 ? null : $"Program exited with status {exitCode}.", diagnostics = Array.Empty<object>() });
        }
        catch (Exception exception)
        {
            var error = exception is TargetInvocationException { InnerException: not null } wrapped ? wrapped.InnerException : exception;
            return JsonSerializer.Serialize(new { success = false, error = $"{error!.GetType().Name}: {error.Message}", diagnostics = Array.Empty<object>() });
        }
    }

    private static string Diagnostics(IEnumerable<Diagnostic> diagnostics) => JsonSerializer.Serialize(new
    {
        success = false,
        error = "Compilation failed.",
        diagnostics = diagnostics.Where(d => d.Severity is DiagnosticSeverity.Error or DiagnosticSeverity.Warning).Select(d => new
        {
            line = d.Location.GetLineSpan().StartLinePosition.Line + 1,
            column = d.Location.GetLineSpan().StartLinePosition.Character + 1,
            code = d.Id,
            message = d.GetMessage(),
            severity = d.Severity.ToString().ToLowerInvariant()
        })
    });

    private sealed class BrowserWriter : TextWriter
    {
        public override Encoding Encoding => Encoding.UTF8;
        public override void Write(char value) => BrowserHost.Write(value.ToString());
        public override void Write(string? value) { if (value is not null) BrowserHost.Write(value); }
        public override void WriteLine(string? value) => BrowserHost.Write((value ?? "") + "\n");
    }
    private sealed class BrowserReader : TextReader
    {
        public override string? ReadLine() => BrowserHost.Read("line");
        public override int Read() { var value = BrowserHost.Read("char"); return value.Length == 0 ? -1 : value[0]; }
    }
    private sealed class ConsoleInputRewriter(SemanticModel model) : CSharpSyntaxRewriter
    {
        public override SyntaxNode? VisitMemberAccessExpression(MemberAccessExpressionSyntax node)
        {
            if (IsBridged(model.GetSymbolInfo(node).Symbol))
                return SyntaxFactory.ParseExpression("global::BrowserConsole." + node.Name.Identifier.Text).WithTriviaFrom(node);
            return base.VisitMemberAccessExpression(node);
        }
        public override SyntaxNode? VisitIdentifierName(IdentifierNameSyntax node)
        {
            if (node.Parent is not MemberAccessExpressionSyntax && IsBridged(model.GetSymbolInfo(node).Symbol))
                return SyntaxFactory.ParseExpression("global::BrowserConsole." + node.Identifier.Text).WithTriviaFrom(node);
            return base.VisitIdentifierName(node);
        }
        private static bool IsBridged(ISymbol? symbol) => symbol?.ContainingType?.ToDisplayString() == "System.Console"
            && symbol.Name is "ReadKey" or "ReadLine" or "Read" or "Clear" or "KeyAvailable";
    }
}

public static class BrowserConsole
{
    public static string ReadLine() => BrowserHost.Read("line");
    public static int Read() { var value = BrowserHost.Read("char"); return value.Length == 0 ? -1 : value[0]; }
    public static ConsoleKeyInfo ReadKey() => ReadKey(false);
    public static ConsoleKeyInfo ReadKey(bool intercept)
    {
        using var json = JsonDocument.Parse(BrowserHost.Read("key"));
        var key = json.RootElement;
        var text = key.GetProperty("char").GetString() ?? "";
        var character = text.Length > 0 ? text[0] : '\0';
        if (!intercept && character != '\0') BrowserHost.Write(character.ToString());
        return new ConsoleKeyInfo(character, (ConsoleKey)key.GetProperty("keyCode").GetInt32(),
            key.GetProperty("shift").GetBoolean(), key.GetProperty("alt").GetBoolean(), key.GetProperty("ctrl").GetBoolean());
    }
    public static bool KeyAvailable => BrowserHost.Read("available") == "true";
    public static void Clear() => BrowserHost.Clear();
}
