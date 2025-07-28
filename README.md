# Raas All Stars Scoreboard Hub

A comprehensive web application for tracking collegiate Raas dance competitions, team standings, and fantasy league management.

## 🏆 Project Overview

The Raas All Stars Scoreboard Hub is a modern web application designed to provide real-time tracking of collegiate Raas dance competitions across the United States. The platform features team standings, competition results, fantasy league management, and detailed team profiles.

## ✨ Features

### 📊 Standings Tab
- Real-time team rankings based on bid points
- Top 9 teams qualification system for Raas All Stars
- Team cards with university info, logos, and bid points
- Locked-in status indicators for qualified teams

### 🏅 Competitions Tab
- Season competition tracking with past and upcoming events
- Competition simulation for future events
- Detailed competition information including:
  - Team lineups with logos and names
  - Top 3 placings with team details
  - Competition dates, locations, and judges
  - Instagram links and media

### ⚡ Fantasy Tab
- Fantasy league management system
- Team owner tracking and point calculations
- Weekly change indicators
- Dancer selection and captain assignments

### 👥 Teams Tab
- Comprehensive team directory
- Team profiles with university information
- Historical achievements and team history
- Competition attendance tracking

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Directus CMS
- **State Management**: React hooks
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Directus CMS instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd raas-allstars-scoreboard-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_DIRECTUS_URL=your_directus_url
   VITE_DIRECTUS_TOKEN=your_directus_token
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # shadcn/ui components
│   ├── CompetitionCard.tsx
│   ├── CompetitionDetail.tsx
│   ├── CompetitionsTab.tsx
│   ├── FantasyTab.tsx
│   ├── TeamCard.tsx
│   └── TeamDetail.tsx
├── lib/
│   ├── api.ts         # Directus API functions
│   ├── types.ts       # TypeScript type definitions
│   ├── utils.ts       # Utility functions
│   └── competitionMapping.ts  # Competition data mapping
├── pages/
│   └── Index.tsx      # Main application page
└── logos/             # Team logo assets
```

## 🗄️ Database Schema

### Teams Collection
- Team information (name, university, logo)
- Bid points and qualification status
- Competition attendance tracking
- Team history and achievements

### Competitions Collection
- Competition details (name, date, location)
- Team lineups (many-to-many relationship)
- Top 3 placings with team references
- Judge information and media links

## 🔧 Development

### Key Features Implemented
- **Real-time data fetching** from Directus CMS
- **Robust team mapping** for competition lineups and placings
- **Responsive design** for mobile and desktop
- **Error handling** and loading states
- **TypeScript** for type safety

### Recent Updates
- Fixed competition lineup display issues
- Implemented proper team object mapping
- Added deep population for Directus relations
- Enhanced error handling for junction table structures

## 🚀 Deployment

### Via Lovable
1. Open [Lovable](https://lovable.dev/projects/bac76a51-37e0-434d-a7a9-4238d1557291)
2. Click Share → Publish

### Custom Domain
Navigate to Project > Settings > Domains and click Connect Domain.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Raas community**
