import {useState} from "react";

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      <header className="text-xl font-bold leading-[4rem]">AI-Interviewer</header>
      <section className="grid place-content-center py-8">
        <button
          className={`h-64 w-64 rounded-full border-8 border-neutral-600 transition-colors ${isRecording ? "bg-red-500" : "bg-red-700"}`}
          onClick={() => setIsRecording(!isRecording)}
        />
      </section>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()} AI-Interviewer
      </footer>
    </main>
  );
}

export default App;
