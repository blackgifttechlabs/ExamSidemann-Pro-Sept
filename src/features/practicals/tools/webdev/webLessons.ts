export interface WebExample {
  title: string;
  text: string;
  code: string;
  /** Height of the rendered result box, in px. */
  height?: number;
}

export interface WebTopic {
  id: string;
  title: string;
  /** Tag(s) shown as the big glyph on the card, e.g. "<p>". */
  glyph: string;
  gradient: string;
  /** Scanned exam question shown above the model answer. */
  image?: string;
  definition: string;
  simple: string;
  reallife: string;
  examples: WebExample[];
  /** One-line job for the "Do it yourself" editor. */
  task: string;
}

export interface WebCategory {
  id: string;
  title: string;
  glyph: string;
  gradient: string;
  enabled: boolean;
  topics: WebTopic[];
}

const G = {
  blue: 'from-sky-400 to-blue-600',
  green: 'from-emerald-400 to-teal-600',
  orange: 'from-amber-400 to-orange-600',
  purple: 'from-fuchsia-500 to-purple-700',
  pink: 'from-rose-400 to-pink-600',
  indigo: 'from-indigo-400 to-violet-600',
  slate: 'from-slate-400 to-slate-600',
};

const TEXT_TOPICS: WebTopic[] = [
  {
    id: 'html5',
    title: 'HTML5 Page Structure: html, head, body',
    glyph: '<html>',
    gradient: G.orange,
    definition:
      'Every HTML5 page has the same skeleton. DOCTYPE tells the browser it is HTML5, html wraps the whole page, head holds information about the page (title, meta), and body holds everything the user sees.',
    simple: '',
    reallife: '',
    task: 'Write the full skeleton and put an h1 in the body.',
    examples: [
      {
        title: 'The HTML5 skeleton',
        text: '',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>My first page</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>Only the body shows on the page.</p>\n</body>\n</html>',
        height: 140,
      },
    ],
  },
  {
    id: 'p',
    title: 'Paragraphs: p',
    glyph: '<p>',
    gradient: G.blue,
    definition: 'The p element holds one paragraph of text. The browser puts space above and below it.',
    simple: 'Every time you write a block of sentences on a web page, wrap it in <p> and </p>.',
    reallife: 'Think of an exercise book. Each paragraph starts on a new line with a gap. <p> does that for you.',
    task: 'Write two paragraphs about your school.',
    examples: [
      { title: 'One paragraph', text: 'Text goes between the opening and closing tag.', code: '<p>Welcome to my school website.</p>', height: 70 },
      { title: 'Two paragraphs', text: 'Each p starts on a new line with a gap.', code: '<p>My name is Lado.</p>\n<p>I am learning HTML.</p>', height: 110 },
    ],
  },
  {
    id: 'headings',
    title: 'Headings: h1 to h6',
    glyph: '<h1>',
    gradient: G.purple,
    definition: 'Headings give titles to sections. h1 is the biggest and most important. h6 is the smallest.',
    simple: 'Use one h1 for the page title. Use h2 for main sections, h3 for parts inside a section, and so on.',
    reallife: 'A newspaper has one big front-page headline, then smaller headlines for each story. Headings work the same way.',
    task: 'Make a page with an h1 title and two h2 sections.',
    examples: [
      { title: 'All six levels', text: 'The number gets bigger, the text gets smaller.', code: '<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>\n<h4>Heading 4</h4>\n<h5>Heading 5</h5>\n<h6>Heading 6</h6>', height: 250 },
      { title: 'Headings with text', text: 'A heading followed by a paragraph.', code: '<h1>My Tuck Shop</h1>\n<h2>Menu</h2>\n<p>Pies, buns and cold drinks.</p>', height: 170 },
    ],
  },
  {
    id: 'bold',
    title: 'Bold Text: strong and b',
    glyph: '<b>',
    gradient: G.orange,
    definition: 'strong marks text as very important and shows it bold. b makes text bold without adding importance.',
    simple: 'Use strong when the words really matter. Use b when you only want the look of bold.',
    reallife: 'A warning sign says "DANGER" in bold. That word is important, so it would be strong.',
    task: 'Write a sentence with one important word in strong.',
    examples: [
      { title: 'strong', text: 'Important text.', code: '<p>Exams start on <strong>Monday</strong>.</p>', height: 70 },
      { title: 'b', text: 'Bold for style only.', code: '<p>Shopping list: <b>bread</b>, <b>milk</b>, <b>eggs</b>.</p>', height: 70 },
    ],
  },
  {
    id: 'italic',
    title: 'Italic Text: em and i',
    glyph: '<i>',
    gradient: G.pink,
    definition: 'em stresses a word, the way your voice would. i shows text in italics for names, terms or thoughts.',
    simple: 'Use em to put stress on a word. Use i for things like book titles or foreign words.',
    reallife: 'Say "I did NOT take it" and "I did not TAKE it". The stress changes the meaning. em marks that stress.',
    task: 'Write a sentence with an em word and a book title in i.',
    examples: [
      { title: 'em', text: 'Stressed word.', code: '<p>I said <em>tomorrow</em>, not today.</p>', height: 70 },
      { title: 'i', text: 'Italic for a title.', code: '<p>I am reading <i>Nervous Conditions</i>.</p>', height: 70 },
    ],
  },
  {
    id: 'span',
    title: 'Inline Container: span',
    glyph: '<span>',
    gradient: G.green,
    definition: 'span wraps a small piece of text inside a line so you can style or target just that part.',
    simple: 'By itself span changes nothing. It is a hook that lets CSS or JavaScript pick out a few words.',
    reallife: 'It is like using a highlighter pen on a few words in a line. The line stays the same but those words stand out.',
    task: 'Use a span with a style to colour one word red.',
    examples: [
      { title: 'span with style', text: 'Only the word inside the span turns red.', code: '<p>My favourite colour is <span style="color: red;">red</span>.</p>', height: 70 },
      { title: 'Two spans', text: 'Style different words differently.', code: '<p>Pass: <span style="color: green;">80%</span> Fail: <span style="color: red;">30%</span></p>', height: 70 },
    ],
  },
  {
    id: 'blockquote',
    title: 'Long Quotation: blockquote',
    glyph: '<blockquote>',
    gradient: G.indigo,
    definition: 'blockquote holds a long quotation taken from another source. Browsers indent it.',
    simple: 'When you copy a whole sentence or paragraph from someone else, put it in blockquote.',
    reallife: 'In an essay you set a long quote apart from your own words. blockquote does that visually.',
    task: 'Quote a famous saying inside a blockquote.',
    examples: [
      { title: 'A blockquote', text: 'The quote is indented from the sides.', code: '<blockquote>\n  Education is the most powerful weapon which you can use to change the world.\n</blockquote>\n<p>Nelson Mandela</p>', height: 150 },
    ],
  },
  {
    id: 'q',
    title: 'Short Quotation: q',
    glyph: '<q>',
    gradient: G.pink,
    definition: 'q holds a short quotation inside a sentence. The browser adds quotation marks for you.',
    simple: 'Use q for a few words inside a line. Use blockquote for a long quote that stands alone.',
    reallife: 'When you say, "My teacher said <q>read every night</q>", the spoken words are the quote.',
    task: 'Write a sentence that contains a q.',
    examples: [
      { title: 'Inline quote', text: 'Notice the quotation marks you did not type.', code: '<p>My teacher said <q>practise every day</q>.</p>', height: 70 },
    ],
  },
  {
    id: 'code',
    title: 'Code Snippet: code',
    glyph: '</>',
    gradient: G.slate,
    definition: 'code shows a piece of computer code. Browsers display it in a monospace font.',
    simple: 'Wrap anything a computer would read in code, such as a tag name or a command.',
    reallife: 'A recipe book prints the exact oven setting in a special style. code does that for program text.',
    task: 'Write a sentence that shows a tag name inside code.',
    examples: [
      { title: 'Inline code', text: 'Monospace so every character lines up.', code: '<p>Use the <code>&lt;p&gt;</code> tag for paragraphs.</p>', height: 70 },
      { title: 'Why &lt; and &gt;?', text: 'Browsers treat < as the start of a tag, so write &lt; to show it.', code: '<p>Write <code>&lt;h1&gt;Hello&lt;/h1&gt;</code> for a heading.</p>', height: 70 },
    ],
  },
  {
    id: 'small',
    title: 'Smaller Text: small',
    glyph: '<small>',
    gradient: G.orange,
    definition: 'small shows text a bit smaller. It is for side notes, fine print and copyright lines.',
    simple: 'Use it for text that matters less than the main text.',
    reallife: 'The fine print at the bottom of an advert, like "terms apply", is small text.',
    task: 'Add a small copyright line under a paragraph.',
    examples: [
      { title: 'Fine print', text: 'Smaller than the text around it.', code: '<p>Airtime sale today only.</p>\n<small>Terms and conditions apply.</small>', height: 90 },
    ],
  },
  {
    id: 'supsub',
    title: 'Superscript and Subscript: sup and sub',
    glyph: 'x²',
    gradient: G.green,
    definition: 'sup raises text above the line (powers). sub lowers text below the line (bases and chemical formulas).',
    simple: 'Use sup for things like 10², and sub for things like H₂O.',
    reallife: 'In maths class you write 5 squared as 5 with a small 2 up high. In science you write water as H with a small 2 down low.',
    task: 'Write the formula for water and the number 3 squared.',
    examples: [
      { title: 'sup (power)', text: 'The 2 sits above the line.', code: '<p>3<sup>2</sup> = 9</p>', height: 70 },
      { title: 'sub (base)', text: 'The 2 sits below the line.', code: '<p>Water is H<sub>2</sub>O</p>', height: 70 },
      { title: 'Both together', text: 'Mix them in one line.', code: '<p>x<sup>2</sup> + y<sub>1</sub> = 10</p>', height: 70 },
    ],
  },
];

const FORM_TOPICS: WebTopic[] = [
  {
    id: 'button',
    title: 'Button: button',
    glyph: '<button>',
    gradient: G.blue,
    definition: 'The button element makes a clickable button. JavaScript can run when it is clicked.',
    simple: 'Put the label between <button> and </button>. The label is what the user reads.',
    reallife: 'Like the call button on a lift. You press it and something happens.',
    task: 'Make a button that says "Submit".',
    examples: [
      { title: 'A basic button', text: 'It looks like a button and can be clicked.', code: '<button>Click me</button>', height: 70 },
      { title: 'Button with a type', text: 'type="button" stops it from submitting a form.', code: '<button type="button">Save</button>\n<button type="reset">Clear</button>', height: 70 },
    ],
  },
  {
    id: 'text',
    title: 'Text Input: input type text',
    glyph: 'Abc',
    gradient: G.green,
    definition: 'input with type="text" gives a single-line box where the user types words or letters.',
    simple: 'input has no closing tag. The type attribute decides what kind of box it is.',
    reallife: 'The "Name" line on a paper form is a text input.',
    task: 'Make a text box for a student name.',
    examples: [
      { title: 'Text box with label', text: 'The label tells the user what to type.', code: '<label>Name: <input type="text"></label>', height: 70 },
      { title: 'Placeholder', text: 'placeholder shows a grey hint that disappears when typing.', code: '<input type="text" placeholder="Enter your name">', height: 70 },
    ],
  },
  {
    id: 'number',
    title: 'Number Input: input type number',
    glyph: '123',
    gradient: G.orange,
    definition: 'input with type="number" accepts only numbers and shows small up and down arrows.',
    simple: 'Use min, max and step to limit what the user can enter.',
    reallife: 'An age box on a form should only take numbers, so a number input blocks letters.',
    task: 'Make a number box for age between 5 and 100.',
    examples: [
      { title: 'Number box', text: 'Try typing a letter. It will not work.', code: '<label>Age: <input type="number"></label>', height: 70 },
      { title: 'Min and max', text: 'The arrows stay between 1 and 10.', code: '<label>Score: <input type="number" min="1" max="10" value="5"></label>', height: 70 },
    ],
  },
  {
    id: 'select',
    title: 'Dropdown: select',
    glyph: '<select>',
    gradient: G.purple,
    definition: 'select makes a dropdown list. Each choice is an option element inside it.',
    simple: 'The user picks one choice from a list. The value attribute is what gets sent.',
    reallife: 'Choosing your province from a list on a form.',
    task: 'Make a dropdown of three subjects.',
    examples: [
      { title: 'A dropdown', text: 'Click it to see the options.', code: '<select>\n  <option>Maths</option>\n  <option>English</option>\n  <option>Science</option>\n</select>', height: 90 },
      { title: 'Default choice', text: 'selected picks the starting option.', code: '<select>\n  <option>Form 1</option>\n  <option selected>Form 2</option>\n  <option>Form 3</option>\n</select>', height: 90 },
    ],
  },
  {
    id: 'radio',
    title: 'Radio Button: input type radio',
    glyph: '◉',
    gradient: G.pink,
    definition: 'Radio buttons let the user choose exactly one option from a group. They share the same name.',
    simple: 'Give every button in the group the same name. Picking one unpicks the others.',
    reallife: 'A multiple-choice question where only one answer is allowed.',
    task: 'Make radio buttons for gender or for A, B and C.',
    examples: [
      { title: 'Radio group', text: 'Only one can be selected at a time.', code: '<label><input type="radio" name="size"> Small</label><br>\n<label><input type="radio" name="size"> Medium</label><br>\n<label><input type="radio" name="size"> Large</label>', height: 120 },
      { title: 'Pre-selected', text: 'checked selects one from the start.', code: '<label><input type="radio" name="pay" checked> Cash</label>\n<label><input type="radio" name="pay"> EcoCash</label>', height: 70 },
    ],
  },
  {
    id: 'checkbox',
    title: 'Checkbox: input type checkbox',
    glyph: '☑',
    gradient: G.indigo,
    definition: 'A checkbox is a box the user ticks on or off. Many can be ticked in one group.',
    simple: 'Each checkbox is separate. The user can pick none, one or many.',
    reallife: 'A list of subjects where you tick all the ones you take.',
    task: 'Make checkboxes for three hobbies.',
    examples: [
      { title: 'Checkboxes', text: 'Tick as many as you like.', code: '<label><input type="checkbox"> Football</label><br>\n<label><input type="checkbox"> Music</label><br>\n<label><input type="checkbox"> Reading</label>', height: 120 },
      { title: 'Agree box', text: 'A single box, ticked from the start.', code: '<label><input type="checkbox" checked> I agree to the rules</label>', height: 70 },
    ],
  },
  {
    id: 'textarea',
    title: 'Multi-line Text: textarea',
    glyph: '<textarea>',
    gradient: G.green,
    definition: 'textarea is a bigger box where the user can type many lines of text.',
    simple: 'Use rows and cols to set how big it is. Unlike input, it has a closing tag.',
    reallife: 'The "Comments" space on a feedback form.',
    task: 'Make a comment box that is 4 rows tall.',
    examples: [
      { title: 'A comment box', text: 'Press Enter to start a new line.', code: '<textarea rows="4" cols="30" placeholder="Write your comment"></textarea>', height: 120 },
    ],
  },
  {
    id: 'password',
    title: 'Password: input type password',
    glyph: '••••',
    gradient: G.slate,
    definition: 'input with type="password" hides what the user types by showing dots.',
    simple: 'It works like a text box, but nobody looking over the shoulder can read it.',
    reallife: 'The PIN pad at an ATM hides your number with stars.',
    task: 'Make a login form with a username and a password.',
    examples: [
      { title: 'Password box', text: 'Type something. You only see dots.', code: '<label>Password: <input type="password"></label>', height: 70 },
      { title: 'Login pair', text: 'A username box and a password box together.', code: '<label>Username: <input type="text"></label><br><br>\n<label>Password: <input type="password"></label>', height: 100 },
    ],
  },
];

const STRUCTURE_TOPICS: WebTopic[] = [
  {
    id: 'hr',
    title: 'Horizontal Rule: hr',
    glyph: '<hr>',
    gradient: G.orange,
    definition: 'hr draws a line across the page. It splits one topic from the next.',
    simple: 'hr has no closing tag. Place it between two pieces of content.',
    reallife: 'A ruled line across an exercise book page to separate one question from another.',
    task: 'Put a line between two paragraphs.',
    examples: [
      { title: 'A line break between topics', text: 'A thin line separates the two sections.', code: '<h2>Maths</h2>\n<p>Algebra and geometry.</p>\n<hr>\n<h2>English</h2>\n<p>Grammar and comprehension.</p>', height: 190 },
    ],
  },
  {
    id: 'br',
    title: 'Line Break: br',
    glyph: '<br>',
    gradient: G.blue,
    definition: 'br forces the text to start on a new line without starting a new paragraph.',
    simple: 'br has no closing tag. Each br is one Enter key press.',
    reallife: 'Writing an address on an envelope. Each part goes on its own line, but it is still one address.',
    task: 'Write your address on three lines using br.',
    examples: [
      { title: 'Without br', text: 'The browser joins everything on one line.', code: '<p>12 Main Street Harare Zimbabwe</p>', height: 70 },
      { title: 'With br', text: 'Each br starts a new line.', code: '<p>12 Main Street<br>Harare<br>Zimbabwe</p>', height: 110 },
    ],
  },
  {
    id: 'fieldset',
    title: 'Border Container: fieldset and legend',
    glyph: '<fieldset>',
    gradient: G.purple,
    definition: 'fieldset draws a border around related form controls. legend is the title written on that border.',
    simple: 'Put legend first inside fieldset. Then put the controls after it.',
    reallife: 'A paper form has a boxed section called "Personal details" and another called "Contact details". Those are fieldsets.',
    task: 'Make a fieldset titled "Contact" with two inputs.',
    examples: [
      { title: 'A fieldset with legend', text: 'The legend sits on the border line.', code: '<fieldset>\n  <legend>Personal details</legend>\n  <label>Name: <input type="text"></label><br><br>\n  <label>Age: <input type="number"></label>\n</fieldset>', height: 170 },
    ],
  },
];

const IMG = '/images/courses/nd-it/web-development/exam-practice';

const page = (title: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body>
${body}
</body>
</html>`;

const EXAM_TOPICS: WebTopic[] = [
  {
    id: 'exam-starjet',
    title: 'Starjet Club Enrolment Form',
    glyph: '1',
    gradient: G.orange,
    image: `${IMG}/q1.webp`,
    definition:
      'Design a web page with this form. From the age list users can choose 0-19, 20-29, 30-39, 40-49 and 50-59. A file is downloaded when users click "Click here to download our privacy policy". The file name is "privacy policy.txt". (20 marks)',
    simple: '',
    reallife: '',
    task: 'Build the Starjet Club form.',
    examples: [
      {
        title: 'Model answer',
        text: '',
        code: page(
          'Starjet Club',
          `  <form>
    <fieldset>
      <legend>Starjet Club Member Enrollment</legend>
      <p>Full name: <input type="text" name="fullname"></p>
      <p>Email Address: <input type="email" name="email"></p>
      <p>Gender:
        <input type="radio" name="gender" value="female"> Female
        <input type="radio" name="gender" value="male"> Male
      </p>
      <p>Age:
        <select name="age">
          <option>0-19</option>
          <option>20-29</option>
          <option>30-39</option>
          <option>40-49</option>
          <option>50-59</option>
        </select>
      </p>
      <p>Home address: <input type="text" name="address"></p>
      <p>Additional service:</p>
      <p><input type="checkbox" name="service" checked> Campaign distribution service (free)</p>
      <p><input type="checkbox" name="service"> Mileage service (10 usd/year)</p>
      <p><input type="checkbox" name="service"> Free wifi service (20 usd/year)</p>
      <p><input type="checkbox" name="service"> Lounge service (30 usd/year)</p>
      <button type="submit">Register</button>
      <button type="reset">Cancel</button>
      <p><a href="privacy policy.txt" download="privacy policy.txt">Click here to download our privacy policy</a></p>
    </fieldset>
  </form>`,
        ),
      },
    ],
  },
  {
    id: 'exam-ecommerce',
    title: 'Electronic Commerce Website',
    glyph: '2',
    gradient: G.blue,
    image: `${IMG}/q2.webp`,
    definition: 'Write HTML code to produce the following electronic commerce website. (30 marks)',
    simple: '',
    reallife: '',
    task: 'Build the electronic commerce form.',
    examples: [
      {
        title: 'Model answer',
        text: '',
        code: page(
          'Electronic Commerce',
          `  <form>
    <fieldset>
      <legend>ELECTRONIC COMMERCE WEBSITE</legend>
      <p>Please supply the following information</p>
      <p>First Name: <input type="text" name="first"></p>
      <p>Last Name: <input type="text" name="last"></p>
      <p>Select Product:<br>
        <select name="product" size="4">
          <option>Mother boards</option>
          <option>Processors</option>
          <option>Cases</option>
          <option>Power supplies</option>
        </select>
      </p>
      <p>Address:<br><textarea name="address" rows="4" cols="35"></textarea></p>
      <fieldset>
        <legend>Contact me via</legend>
        <label><input type="checkbox" name="contact"> Email</label><br>
        <label><input type="checkbox" name="contact"> Postal mail</label>
      </fieldset>
      <p>How soon will you be buying hardware?</p>
      <label><input type="radio" name="when"> ASAP</label><br>
      <label><input type="radio" name="when"> Within 10 business days</label><br>
      <label><input type="radio" name="when"> Within the month</label><br>
      <label><input type="radio" name="when"> Never!</label>
      <p>
        <input type="submit" value="Submit">
        <input type="reset" value="Reset">
        <input type="button" value="Leave Site">
      </p>
    </fieldset>
  </form>`,
        ),
      },
    ],
  },
  {
    id: 'exam-hotel',
    title: 'Hotel Dombo Web Page',
    glyph: '3',
    gradient: G.green,
    image: `${IMG}/q3.webp`,
    definition:
      'a) i) Create a web page as shown. Insert a picture as indicated. (7 marks) ii) Create a link "click here" under the picture, to the site http://ww.gmail.com. (3 marks)',
    simple: '',
    reallife: '',
    task: 'Build the Hotel Dombo page with a picture and a link.',
    examples: [
      {
        title: 'Part i: the page and picture',
        text: '',
        code: page(
          'Hotel Dombo',
          `  <h3>Hotel Dombo</h3>
  <p>Welcome to Hotel Dombo</p>
  <p>Situated on a plateau just 4km from the majestic Victoria Falls in Zimbabwe,
    the award-winning Hotel Dombo, surrounded by the wilds of Africa, offers
    <u>an unforgettable experience</u>.</p>
  <img src="${IMG}/picture.png" alt="Picture" width="200">`,
        ),
      },
      {
        title: 'Part ii: the link',
        text: '',
        code: page(
          'Hotel Dombo',
          `  <h3>Hotel Dombo</h3>
  <p>Welcome to Hotel Dombo</p>
  <p>Situated on a plateau just 4km from the majestic Victoria Falls in Zimbabwe,
    the award-winning Hotel Dombo, surrounded by the wilds of Africa, offers
    <u>an unforgettable experience</u>.</p>
  <img src="${IMG}/picture.png" alt="Picture" width="200">
  <p><a href="http://ww.gmail.com">click here</a></p>`,
        ),
      },
    ],
  },
  {
    id: 'exam-product',
    title: 'Product Registration Form',
    glyph: '4',
    gradient: G.purple,
    image: `${IMG}/q4.webp`,
    definition:
      'a) Write a program to produce the product registration form below. (20 marks) b) Create an html document with a green background colour, and also an image of your choice. Use the width, border, height and alt attributes on your image. (10 marks)',
    simple: '',
    reallife: '',
    task: 'Build the product registration form.',
    examples: [
      {
        title: 'Part a: the form',
        text: '',
        code: page(
          'Product Registration',
          `  <form>
    <fieldset>
      <legend>PRODUCT REGISTRATION FORM</legend>
      <p>Product <input type="text" name="product"></p>
      <p>Product ID <input type="text" name="id"></p>
      <p>Quantity <input type="text" name="qty"></p>
      <p>Unit Price <input type="text" name="price"></p>
      <p>Please select Your Product
        <select name="choice" size="3">
          <option>Sugar</option>
          <option>Salt</option>
          <option>Banana</option>
        </select>
      </p>
      <p>Method of payment</p>
      <p>Cash <input type="radio" name="pay" value="cash"></p>
      <p>Bank <input type="radio" name="pay" value="bank"></p>
    </fieldset>
  </form>`,
        ),
      },
      {
        title: 'Part b: green background and image',
        text: '',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My image</title>
</head>
<body bgcolor="green" style="background-color: green;">
  <img src="${IMG}/picture.png" width="250" height="140" border="3" alt="A grey picture box">
</body>
</html>`,
      },
    ],
  },
  {
    id: 'exam-table-lists',
    title: 'Table, Enrolment Form and Lists',
    glyph: '5',
    gradient: G.pink,
    image: `${IMG}/q5.webp`,
    definition:
      'a) Design a table with five columns: first name, surname, gender, age and email address. Capture five records. (10 marks) b) Design a form to enrol pupils with the pupil and the parent details, and Save and Cancel buttons at the bottom. (10 marks) c) Number the months May, April and December in Roman numerals and list their holidays as bullets. (10 marks)',
    simple: '',
    reallife: '',
    task: 'Build the table, the form and the nested list.',
    examples: [
      {
        title: 'Part a: the table',
        text: '',
        code: page(
          'Records',
          `  <table border="1" cellpadding="6">
    <tr>
      <th>First name</th><th>Surname</th><th>Gender</th><th>Age</th><th>Email address</th>
    </tr>
    <tr><td>Tendai</td><td>Moyo</td><td>Male</td><td>17</td><td>tendai@mail.com</td></tr>
    <tr><td>Rudo</td><td>Ncube</td><td>Female</td><td>16</td><td>rudo@mail.com</td></tr>
    <tr><td>Farai</td><td>Dube</td><td>Male</td><td>18</td><td>farai@mail.com</td></tr>
    <tr><td>Chipo</td><td>Sibanda</td><td>Female</td><td>15</td><td>chipo@mail.com</td></tr>
    <tr><td>Tapiwa</td><td>Zhou</td><td>Male</td><td>17</td><td>tapiwa@mail.com</td></tr>
  </table>`,
        ),
      },
      {
        title: 'Part b: the enrolment form',
        text: '',
        code: page(
          'Pupil Enrolment',
          `  <form>
    <fieldset>
      <legend>Pupil details</legend>
      <p>First name: <input type="text" name="pfirst"></p>
      <p>Surname: <input type="text" name="psurname"></p>
      <p>Date of birth: <input type="date" name="dob"></p>
      <p>Gender:
        <label><input type="radio" name="pgender"> Male</label>
        <label><input type="radio" name="pgender"> Female</label>
      </p>
    </fieldset>
    <fieldset>
      <legend>Parent details</legend>
      <p>Full name: <input type="text" name="parent"></p>
      <p>Phone: <input type="text" name="phone"></p>
      <p>Address: <textarea name="address" rows="3" cols="30"></textarea></p>
    </fieldset>
    <p>
      <button type="submit">Save</button>
      <button type="reset">Cancel</button>
    </p>
  </form>`,
        ),
      },
      {
        title: 'Part c: nested lists',
        text: '',
        code: page(
          'Holidays',
          `  <ol type="I">
    <li>May
      <ul>
        <li>Workers' Day</li>
        <li>Africa Day</li>
      </ul>
    </li>
    <li>April
      <ul>
        <li>Independence Day</li>
        <li>Good Friday</li>
      </ul>
    </li>
    <li>December
      <ul>
        <li>Christmas Day</li>
        <li>Boxing Day</li>
      </ul>
    </li>
  </ol>`,
        ),
      },
    ],
  },
  {
    id: 'exam-loan',
    title: 'XYZ Loan Facility Form',
    glyph: '6',
    gradient: G.indigo,
    image: `${IMG}/q6.webp`,
    definition: 'Write an html program to produce the following form. (15 marks)',
    simple: '',
    reallife: '',
    task: 'Build the XYZ loan facility form.',
    examples: [
      {
        title: 'Model answer',
        text: '',
        code: page(
          'XYZ Loan Facility',
          `  <h3>Welcome to XYZ loan facility</h3>
  <p>Fill in the form</p>
  <form>
    <fieldset>
      <legend>Personal details</legend>
      <p>Name: <input type="text" name="name">
        Surname: <input type="text" name="surname"></p>
      <p>Address: <input type="text" name="address">
        Cell: <input type="text" name="cell"></p>
      <p>Gender:
        <label><input type="radio" name="gender"> Male</label>
        <label><input type="radio" name="gender"> Female</label>
      </p>
      <p>Acc Number: <input type="text" name="acc">
        Branch: <input type="text" name="branch"></p>
    </fieldset>
    <p>Specify your requirements</p>
    <label><input type="radio" name="req"> Loan payment</label>
    <label><input type="radio" name="req"> Borrowing</label>
    <p>Select the amount
      <select name="amount">
        <option>$2000.00</option>
        <option>$3000.00</option>
        <option>$5000.00</option>
      </select>
    </p>
    <p>Insert any extra details here<br>
      <textarea name="extra" rows="4" cols="40"></textarea></p>
    <p><label><input type="checkbox" name="agree"> I accept this agreement</label></p>
    <button type="submit">Submit</button>
    <button type="reset">Cancel</button>
  </form>`,
        ),
      },
    ],
  },
];

export const WEB_CATEGORIES: WebCategory[] = [
  { id: 'text', title: 'Text Elements', glyph: 'Aa', gradient: G.blue, enabled: true, topics: TEXT_TOPICS },
  { id: 'forms', title: 'Form Controls', glyph: '☑', gradient: G.green, enabled: true, topics: FORM_TOPICS },
  { id: 'structure', title: 'Lines & Grouping', glyph: '▭', gradient: G.purple, enabled: true, topics: STRUCTURE_TOPICS },
  { id: 'exam', title: 'Exam Practice', glyph: '✎', gradient: G.orange, enabled: true, topics: EXAM_TOPICS },
  { id: 'lists', title: 'Lists & Tables', glyph: '☰', gradient: G.slate, enabled: false, topics: [] },
  { id: 'media', title: 'Links & Images', glyph: '🔗', gradient: G.slate, enabled: false, topics: [] },
  { id: 'css', title: 'CSS Styling', glyph: '🎨', gradient: G.slate, enabled: false, topics: [] },
  { id: 'layout', title: 'Layout', glyph: '▦', gradient: G.slate, enabled: false, topics: [] },
  { id: 'js', title: 'JavaScript', glyph: 'JS', gradient: G.slate, enabled: false, topics: [] },
];

/** Wraps a snippet in a complete page so the editor always starts with valid HTML. */
export const wrapInPage = (body: string): string =>
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My page</title>
</head>
<body>

${body
  .split('\n')
  .map((line) => (line ? `  ${line}` : line))
  .join('\n')}

</body>
</html>`;

export const starterFor = (topic: WebTopic): string =>
  wrapInPage(`<!-- Your turn: ${topic.task} -->\n`);
