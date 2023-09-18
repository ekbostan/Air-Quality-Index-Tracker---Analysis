import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './components/AppBar/AppBar.tsx';
import SearchBar from './components/SearchBar/SearchBar.tsx'

function App() {
  return (
    <div>
    <ResponsiveAppBar/>
    <SearchBar/>
    </div>
  );
}

export default App;
