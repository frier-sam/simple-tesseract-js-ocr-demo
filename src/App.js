// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";
function App() {

  // const worker = createWorker({
  //   logger: (m) => {
  //     console.log(m);
  //     setProgress(parseInt(m.progress * 100));
  //   },
  // }); 
  const [progress, setProgress] = useState(0);
  const [ocr, setOcr] = useState("");
  const [imageData, setImageData] = useState(null);
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      setProgress(parseInt(m.progress * 100));
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    setOcr(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if(!file)return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }
  return (
    // two html bolcks equal size side by side in center of page


    <div className="App row">
      <div className="col-12">
        <p>Choose an Image</p>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      {progress < 100 && progress > 0 && <div>
        <div className="progress-label">Progress ({progress}%)</div>
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}} ></div>
        </div>
      </div>}
      <div className="row">
        <div className="col">
          <img src={imageData} alt="" className="img-thumbnail" style={{'max-width':400}} srcset="" />
        </div>
        <div className="col">
          <p>{ocr}</p>
        </div>
        
      </div>
    </div>
  );
}
export default App;