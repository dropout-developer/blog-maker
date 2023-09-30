# Angular Blog Maker App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Features

- User-friendly interface for inputting keywords and descriptions.
- Integration with OpenAI API to generate blog content.
- Display of generated blog content with a table of contents.
- Hyperlinking of important words or phrases within the blog content.
- SEO optimization features like meta description and tags.

## Setup and Installation

1. Clone the Repository:

   ```bash
   git clone [repository-link]
   cd [repository-name]
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Environment Variables:

   - Create a .env file in the root directory.
   - Add your OpenAI API key:
     ```makefile
     OPEN_AI_API_KEY=your_openai_api_key
     ```

4. Run the Application:
   ```bash
   ng serve
   ```

## Usage

1. Navigate to /create-blog.
2. Input your desired keyword and description.
3. Click on the "Generate Blog" button.
4. View the generated blog content and table of contents.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](https://chat.openai.com/c/CONTRIBUTING.md) to get started.

## Issues and Feedback

If you encounter any issues or have feedback, please [create a new issue](https://github.com/dropout-developer/blog-maker/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](https://chat.openai.com/c/LICENSE.md) file for details.
