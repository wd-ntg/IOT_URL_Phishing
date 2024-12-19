import { useState } from "react";
import "./App.css";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function App() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.prediction === "phishing") {
          setResult(`URL ${url} là giả mạo!`);
          toast({
            variant: "destructive",
            title: "Thông báo",
            description: `URL ${url} là giả mạo!`,
            action: <ToastAction altText="Quay lại">Quay lại</ToastAction>,
          });
        }

        if (data.prediction === "legitimate") {
          setResult(`URL ${url} là hợp pháp!`);
          toast({
            title: "Thông báo",
            description: `URL ${url} là hợp pháp!`,
            action: <ToastAction altText="Quay lại">Quay lại</ToastAction>,
          });
        }
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <h1 className="text-white font-semibold my-6">Phát hiện URL lừa đảo</h1>
      <div
        // onSubmit={handleSubmit}
        className="flex justify-center items-center space-x-4"
      >
        <input
          type="text"
          placeholder="Nhập url ở đây....."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white px-4 py-4 w-full"
        />
      </div>
      {result && <p className="text-white mt-4 font-semibold text-xl">{result}</p>}
    </div>
  );
}

export default App;
