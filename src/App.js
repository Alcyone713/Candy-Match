import './App.css';
import BackgroundAnimation from './Components/BackgroundAnimation';
import Game from './Components/Game';
import Header from './Components/Header';

function App() {
  return (
    <div className="App">
      <Header/>
      <BackgroundAnimation/>
      <Game/>
    </div>
  );
}

export default App;
