import {useState} from "react";

const recognition = new window.webkitSpeechRecognition();
const synth = window.speechSynthesis;

recognition.continuous = true;
recognition.lang = "en-US";

synth.cancel(); // Cancel when refreshing the page

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      role: "user" | "system" | "assistant";
      content: string;
    }[]
  >([
    {
      role: "system",
      content: `You are an IT interviewer evaluating candidates for a junior web developer position. Your tone should be professional and friendly.
      * The answers must not contain any placeholders, such as "name of the company", "my name", etc.
      * The messages must not contain emojies, markdown or special characters (such as using ** to signify bold content, etc.).`,
    },
  ]);

  const handleStartRecording = () => {
    setIsRecording(true);

    synth.cancel(); // Interrupt voice synthesis if the user wants to record a new message
    recognition.start();

    recognition.addEventListener("result", (event) => {
      const buffer = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join(" ");

      setBuffer(buffer);
    });
  };

  const handleEndRecording = async () => {
    setIsRecording(false);
    recognition.stop();

    const draft = structuredClone(messages);

    draft.push({
      role: "user",
      content: buffer,
    });

    const answer = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3",
        stream: false,
        messages: draft,
      }),
    })
      .then(
        (response) => response.json() as Promise<{message: {role: "assistant"; content: string}}>,
      )
      .then((response) => response.message);

    draft.push(answer);

    const utterance = new SpeechSynthesisUtterance(answer.content);

    utterance.lang = "en-US";

    synth.speak(utterance);

    setMessages(draft);
  };

  return (
    <main className="container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4">
      <header className="text-xl font-bold leading-[4rem]">AI-Interviewer</header>
      <section className="grid place-content-center py-8">
        <button
          className={`h-64 w-64 rounded-full border-8 border-neutral-600 transition-colors ${isRecording ? "bg-red-500" : "bg-red-700"}`}
          onClick={isRecording ? handleEndRecording : handleStartRecording}
        />
      </section>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()} AI-Interviewer
      </footer>
    </main>
  );
}

export default App;
