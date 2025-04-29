import ChatComponent from './components/ChatComponent';
import PlainComponent from './components/PlainComponent';
import './index.css';

function App() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <div className="flex-1 border-b md:border-b-0 md:border-r">
        <ChatComponent />
      </div>
      {/* <PlainComponent /> */}
    </div>
  );
}

export default App;