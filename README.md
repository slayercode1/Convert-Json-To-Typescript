# 🔧 JSON2TS - Transform JSON API Responses into TypeScript Interfaces

<div align="center">
  <img src="./capture-d'ecran.png" alt="JSON2TS Interface" width="800">
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://slayercode1.github.io/Convert-Json-To-Typescript/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![GitHub Stars](https://img.shields.io/github/stars/slayercode1/Convert-Json-To-Typescript?style=for-the-badge)](https://github.com/slayercode1/Convert-Json-To-Typescript/stargazers)
</div>

## ✨ Features

- **⚡ Lightning Fast** - Convert JSON to TypeScript interfaces in under a second
- **🎯 Type Safe** - Generate accurate TypeScript interfaces that catch errors at compile time
- **🔧 Customizable** - Unwrap nested data structures and customize interface names
- **🌐 API Ready** - Works with any REST API endpoint - just paste the URL
- **📱 Mobile Friendly** - Responsive design that works perfectly on all devices
- **🎨 Modern UI** - Clean, intuitive interface with syntax highlighting
- **📋 One-Click Copy** - Copy generated interfaces directly to your clipboard

## 🚀 Quick Start

### Online Tool
Simply visit [JSON2TS](https://slayercode1.github.io/Convert-Json-To-Typescript/) and start converting!

### Local Development
```bash
# Clone the repository
git clone https://github.com/slayercode1/Convert-Json-To-Typescript.git

# Navigate to the project directory
cd Convert-Json-To-Typescript

# Open index.html in your browser
open index.html
```

## 🎯 How It Works

1. **Enter API URL** - Paste your JSON API endpoint
2. **Name Your Interface** - Choose a descriptive name for your TypeScript interface
3. **Configure Options** - Optionally unwrap nested data structures
4. **Generate & Copy** - Get your TypeScript interface instantly

### Example

**Input JSON:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

**Generated TypeScript Interface:**
```typescript
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
```

## 🛠️ Technical Features

- **Smart Type Detection** - Automatically detects and converts JavaScript types to TypeScript
- **Nested Object Support** - Handles complex nested structures and arrays
- **Data Unwrapping** - Optional feature to unwrap API response wrappers
- **Error Handling** - Robust error handling for invalid URLs or malformed JSON
- **Syntax Highlighting** - Beautiful code display with highlight.js
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile

## 🎨 Modern Design

- **SaaS-inspired Interface** - Clean, professional design
- **Dark/Light Syntax** - Optimized code highlighting
- **Smooth Animations** - Polished user experience
- **Accessibility** - Designed with accessibility in mind

## 🔧 Configuration Options

- **Interface Naming** - Custom names for your TypeScript interfaces
- **Data Unwrapping** - Toggle to unwrap `data` properties from API responses
- **Array Handling** - Smart detection of array types and their elements

## 🌟 Why JSON2TS?

- **Save Time** - No more manual typing of interface definitions
- **Reduce Errors** - Eliminate typos and type mismatches
- **Improve Productivity** - Focus on building features, not writing boilerplate
- **Type Safety** - Ensure your TypeScript code is properly typed from the start

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Syntax highlighting powered by [highlight.js](https://highlightjs.org/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Inspired by the TypeScript and developer tool communities

---

<div align="center">
  <p>Made with ❤️ for the TypeScript community</p>
  
  [![Star this repo](https://img.shields.io/github/stars/slayercode1/Convert-Json-To-Typescript?style=social)](https://github.com/slayercode1/Convert-Json-To-Typescript/stargazers)
  [![Follow on GitHub](https://img.shields.io/github/followers/slayercode1?style=social)](https://github.com/slayercode1)
</div>