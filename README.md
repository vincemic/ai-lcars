# Star Trek LCARS Dashboard

A stunning recreation of the iconic Star Trek: The Next Generation LCARS (Library Computer Access/Retrieval System) interface built with Angular 17+.

![LCARS Dashboard Preview](https://via.placeholder.com/800x400/000000/FF9900?text=USS+ENTERPRISE+LCARS+DASHBOARD)

## 🚀 Features

- **Authentic LCARS Design**: Faithful recreation of the TNG-era computer interface
- **Real-time Dashboard**: Live ship status monitoring and system displays
- **Interactive Controls**: Functional navigation panels and warp speed controls
- **Dynamic Data**: Animated status indicators with real-time updates
- **Responsive Design**: Optimized for modern devices and screen sizes
- **Star Trek Immersion**: Complete with stardate, ship status, and crew information

## 🛸 Live Demo

Visit the live demo: [Add your GitHub Pages URL here]

## 🔧 Technologies Used

- **Angular 17+**: Modern framework with standalone components
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with LCARS color scheme
- **Angular Signals**: Reactive state management
- **Orbitron Font**: Futuristic typography matching LCARS aesthetic

## 🏗️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/star-trek-lcars-dashboard.git
   cd star-trek-lcars-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 🎮 Usage

The LCARS dashboard simulates the bridge computer interface of the USS Enterprise NCC-1701-D:

- **Navigation Panel**: Click department buttons (Navigation, Sensors, Tactical, etc.)
- **Status Monitoring**: View real-time ship systems status
- **Crew Information**: Monitor personnel and duty assignments
- **System Controls**: Observe warp speed and ship operations
- **Alerts**: Monitor system alerts and status changes

## 📁 Project Structure

```
src/
├── app/
│   ├── app.ts              # Main component with dashboard logic
│   ├── app.html            # LCARS interface template
│   └── app.scss            # LCARS styling and animations
├── styles.scss             # Global LCARS theme
└── index.html              # Application shell
```

## 🎨 LCARS Color Scheme

The project uses the authentic LCARS color palette:
- **Orange**: `#FF9900` (Primary interface elements)
- **Blue**: `#9999FF` (Secondary controls)
- **Red**: `#CC6666` (Alerts and warnings)
- **Purple**: `#CC99CC` (System indicators)
- **Teal**: `#99CCCC` (Data displays)

## 🚀 Build & Deploy

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build --prod
```

### Deploy to GitHub Pages
```bash
npm install -g angular-cli-ghpages
ng build --prod --base-href "/your-repo-name/"
npx angular-cli-ghpages --dir=dist/ai-lcars
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🖖 Acknowledgments

- Inspired by the Star Trek: The Next Generation LCARS interface
- Built with modern web technologies for the 24th century
- "Make it so!" - Captain Jean-Luc Picard

## 🌟 Star Trek Quote

> "The complexity of the universe is beyond measure." - Data

---

**Live long and prosper! 🖖**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
