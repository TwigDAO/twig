// src/App.tsx
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction } from "wagmi";
import "./App.css";

type Mode = "ai" | "manual";

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>("ai");
  const [aiInput, setAiInput] = useState<string>("");
  const [manualCalldata, setManualCalldata] = useState<string>("");
  const [generatedCalldata, setGeneratedCalldata] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock AI response - replace with actual AI service in production
    const mockCalldata =
      "0x12345678" + aiInput.split(" ").join("").toLowerCase();
    setGeneratedCalldata(mockCalldata);
  };

  const handleConfirm = async (calldata: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      sendTransaction({
        to: "0xRecipientAddress" as const, // Replace with actual recipient
        data: calldata as `0x${string}`,
        value: BigInt(0),
      });
      console.log("Transaction sent successfully");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Crypto AI Assistant</h1>
        <ConnectButton />
      </header>

      <div className="mode-toggle">
        <button
          onClick={() => setMode("ai")}
          className={mode === "ai" ? "active" : ""}
        >
          AI Assistant Mode
        </button>
        <button
          onClick={() => setMode("manual")}
          className={mode === "manual" ? "active" : ""}
        >
          Manual Calldata Mode
        </button>
      </div>

      {mode === "ai" ? (
        <div className="ai-mode">
          <form onSubmit={handleAISubmit}>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Describe what you want to do on the blockchain..."
            />
            <button type="submit">Generate Calldata</button>
          </form>

          {generatedCalldata && (
            <div className="result">
              <p>Generated Calldata: {generatedCalldata}</p>
              <button onClick={() => handleConfirm(generatedCalldata)}>
                Confirm Transaction
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="manual-mode">
          <textarea
            value={manualCalldata}
            onChange={(e) => setManualCalldata(e.target.value)}
            placeholder="Enter your calldata here..."
          />
          <button onClick={() => handleConfirm(manualCalldata)}>
            Confirm Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
