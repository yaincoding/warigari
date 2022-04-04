import "./App.css";
import UserImageFashions from "./component/UserImageFashions";
import UserImageFashionsContextProvider from "./context/UserImageFashionsContextProvider";

function App() {
  return (
    <div className="App">
      <div>
        <UserImageFashionsContextProvider>
          <UserImageFashions />
        </UserImageFashionsContextProvider>
      </div>
    </div>
  );
}

export default App;
