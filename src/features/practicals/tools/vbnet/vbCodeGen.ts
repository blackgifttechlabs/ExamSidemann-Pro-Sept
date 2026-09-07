/**
 * The code side of the designer: the empty class a new form starts with, the
 * generated Form1.Designer.vb, the handler stub double-clicking a control
 * writes, and the rename that keeps `Handles Button1.Click` pointing at the
 * control after it has been renamed in the Properties window.
 */

import { VbControl, VbForm, isComponent } from './vbProject';

export const defaultFormCode = (formName: string) =>
  `Public Class ${formName}

End Class
`;

const EVENT_ARGS: Record<string, string> = {
  KeyPress: 'System.Windows.Forms.KeyPressEventArgs',
  KeyDown: 'System.Windows.Forms.KeyEventArgs',
  KeyUp: 'System.Windows.Forms.KeyEventArgs',
  MouseEnter: 'System.EventArgs',
  MouseLeave: 'System.EventArgs',
};

export const handlerSignature = (controlName: string, eventName: string) =>
  `    Private Sub ${controlName}_${eventName}(sender As Object, e As ${
    EVENT_ARGS[eventName] || 'System.EventArgs'
  }) Handles ${controlName}.${eventName}`;

const handlerExists = (code: string, controlName: string, eventName: string) => {
  const pattern = new RegExp(
    `\\bSub\\s+${controlName}_${eventName}\\b|Handles\\s+${controlName}\\.${eventName}\\b`,
    'i'
  );
  return pattern.test(code);
};

/**
 * Adds the handler if it is missing and reports the line the caret should land
 * on — the blank line inside the new Sub, which is where Visual Studio puts it.
 */
export const ensureHandler = (
  code: string,
  controlName: string,
  eventName: string
): { code: string; line: number } => {
  if (handlerExists(code, controlName, eventName)) {
    const lines = code.split('\n');
    const index = lines.findIndex((line) =>
      new RegExp(`\\bSub\\s+${controlName}_${eventName}\\b`, 'i').test(line)
    );
    return { code, line: index >= 0 ? index + 2 : 1 };
  }

  const lines = code.split('\n');
  let insertAt = lines.findIndex((line) => /^\s*End Class\s*$/i.test(line));
  if (insertAt < 0) {
    lines.push('End Class');
    insertAt = lines.length - 1;
  }

  const block = [
    '',
    handlerSignature(controlName, eventName),
    '        ',
    '    End Sub',
  ];
  lines.splice(insertAt, 0, ...block);

  return { code: lines.join('\n'), line: insertAt + 3 };
};

/** Renaming a control has to follow it into the code, Handles clauses first. */
export const renameInCode = (code: string, from: string, to: string) => {
  if (from === to) return code;
  return code.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
};

const colorLiteral = (value: string) => {
  if (!value || value === 'transparent') return 'System.Drawing.Color.Transparent';
  const hex = value.replace('#', '');
  const red = parseInt(hex.slice(0, 2), 16) || 0;
  const green = parseInt(hex.slice(2, 4), 16) || 0;
  const blue = parseInt(hex.slice(4, 6), 16) || 0;
  return `System.Drawing.Color.FromArgb(CType(CType(${red}, Byte), Integer), CType(CType(${green}, Byte), Integer), CType(CType(${blue}, Byte), Integer))`;
};

const controlLines = (control: VbControl): string[] => {
  const lines: string[] = [`        '`, `        '${control.name}`, `        '`];
  const prefix = `        Me.${control.name}`;

  if (!isComponent(control.kind)) {
    lines.push(`${prefix}.Location = New System.Drawing.Point(${control.x}, ${control.y})`);
    lines.push(`${prefix}.Size = New System.Drawing.Size(${control.width}, ${control.height})`);
  }
  lines.push(`${prefix}.Name = "${control.name}"`);
  if (control.text && !['ListBox', 'ProgressBar', 'PictureBox', 'Timer'].includes(control.kind)) {
    lines.push(`${prefix}.Text = "${control.text.replace(/"/g, '""')}"`);
  }
  if (control.fontSize !== 9 || control.bold || control.italic) {
    lines.push(
      `${prefix}.Font = New System.Drawing.Font("Microsoft Sans Serif", ${control.fontSize.toFixed(
        2
      )}!, CType((${control.bold ? 'System.Drawing.FontStyle.Bold' : 'System.Drawing.FontStyle.Regular'}), System.Drawing.FontStyle))`
    );
  }
  if (control.foreColor !== '#000000') lines.push(`${prefix}.ForeColor = ${colorLiteral(control.foreColor)}`);
  if (control.backColor !== '#f0f0f0' && control.backColor !== 'transparent') {
    lines.push(`${prefix}.BackColor = ${colorLiteral(control.backColor)}`);
  }
  if (!control.enabled) lines.push(`${prefix}.Enabled = False`);
  if (!control.visible) lines.push(`${prefix}.Visible = False`);
  if (control.checked) lines.push(`${prefix}.Checked = True`);
  if (control.multiline) lines.push(`${prefix}.Multiline = True`);
  if (control.passwordChar) lines.push(`${prefix}.PasswordChar = Global.Microsoft.VisualBasic.ChrW(${control.passwordChar.charCodeAt(0)})`);
  if (control.items.length > 0) {
    lines.push(`${prefix}.Items.AddRange(New Object() {${control.items.map((item) => `"${item.replace(/"/g, '""')}"`).join(', ')}})`);
  }
  if (control.kind === 'NumericUpDown' || control.kind === 'ProgressBar') {
    lines.push(`${prefix}.Minimum = ${control.minimum}`);
    lines.push(`${prefix}.Maximum = ${control.maximum}`);
    lines.push(`${prefix}.Value = ${control.value}`);
  }
  if (control.kind === 'Timer') {
    lines.push(`${prefix}.Interval = ${control.interval}`);
    if (control.timerEnabled) lines.push(`${prefix}.Enabled = True`);
  }
  if (control.kind === 'PictureBox' && control.imageUrl) {
    lines.push(`${prefix}.ImageLocation = "${control.imageUrl}"`);
  }
  lines.push(`${prefix}.TabIndex = 0`);
  return lines;
};

/**
 * Form1.Designer.vb, generated the way Visual Studio generates it. It is shown
 * read-only: the point is that a student can see the designer writing code, and
 * understand that dragging a Button is the same as typing these lines.
 */
export const designerCode = (form: VbForm): string => {
  const declarations = form.controls
    .map(
      (control) =>
        `    Friend WithEvents ${control.name} As System.Windows.Forms.${control.kind}`
    )
    .join('\n');

  const creations = form.controls
    .map(
      (control) =>
        `        Me.${control.name} = New System.Windows.Forms.${control.kind}(${
          control.kind === 'Timer' ? 'Me.components' : ''
        })`
    )
    .join('\n');

  const settings = form.controls.flatMap(controlLines).join('\n');

  const additions = form.controls
    .filter((control) => !isComponent(control.kind))
    .map((control) => `        Me.Controls.Add(Me.${control.name})`)
    .join('\n');

  return `<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class ${form.name}
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container()
${creations || '        '}
        Me.SuspendLayout()
${settings || '        '}
        '
        '${form.name}
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(${form.width}, ${form.height})
${additions || '        '}
        Me.Name = "${form.name}"
        Me.StartPosition = System.Windows.Forms.FormStartPosition.${form.startPosition}
        Me.FormBorderStyle = System.Windows.Forms.FormBorderStyle.${form.formBorderStyle}
        Me.Text = "${form.text.replace(/"/g, '""')}"
        Me.ResumeLayout(False)
        Me.PerformLayout()
    End Sub

${declarations}
End Class
`;
};
