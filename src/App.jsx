//import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


function App() {
  return (
   <> 
      <Toaster/>
       <main >
        <Outlet/>
       </main>
   </>
  );
}

export default App;


// import React from 'react';
// function App() {
//   return (
//     <>
//       <main className="flex flex-col items-center justify-center min-h-screen bg-purple-50 text-gray-800">
//         <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
//         <p className="text-lg">Your chat experience starts here!</p>
//       </main>
//     </>
//   );
// }   

// export default App;

// function App() {
//   return (
//     <main className="min-h-screen bg-green-500 text-white text-4xl flex items-center justify-center">
//       ✅ Tailwind CSS is fully working!
//     </main>
//   );
// }
// export default App;