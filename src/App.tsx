import ObjectList from './components/ObjectList';
import ObjectForm from './components/ObjectForm';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="App">
      <ObjectForm />
      <SearchBar />
      <ObjectList />
    </div>
  );
}

export default App;
