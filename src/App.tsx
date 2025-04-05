// src/App.tsx
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction } from "wagmi";
import "./App.css";

type Mode = "ai" | "manual";
type ManualType = "batch" | "intent";

// Define the ERC-4337 UserOperation interface with descriptions
interface UserOperation {
  sender: string; // The account initiating the operation
  nonce: string; // Anti-replay parameter
  initCode: string; // Code to deploy the account if not yet created
  callData: string; // Data to execute on the account
  callGasLimit: string; // Gas limit for execution
  verificationGasLimit: string; // Gas limit for verification
  preVerificationGas: string; // Gas for pre-verification steps
  maxFeePerGas: string; // Maximum fee per gas (EIP-1559)
  maxPriorityFeePerGas: string; // Maximum priority fee per gas (EIP-1559)
  paymasterAndData: string; // Paymaster address and data
  signature?: string; // Signature of the UserOp
}

// Field descriptions for display
const userOpFields: {
  key: keyof UserOperation;
  name: string;
  description: string;
}[] = [
  {
    key: "sender",
    name: "Sender",
    description: "The address of the account initiating this operation",
  },
  {
    key: "nonce",
    name: "Nonce",
    description: "A unique number to prevent replay attacks (hex)",
  },
  {
    key: "initCode",
    name: "Init Code",
    description: "Code to deploy the account if it doesn’t exist (hex)",
  },
  {
    key: "callData",
    name: "Call Data",
    description: "The data to execute on the account (hex)",
  },
  {
    key: "callGasLimit",
    name: "Call Gas Limit",
    description: "Gas limit for the execution phase (hex)",
  },
  {
    key: "verificationGasLimit",
    name: "Verification Gas Limit",
    description: "Gas limit for the verification phase (hex)",
  },
  {
    key: "preVerificationGas",
    name: "Pre-Verification Gas",
    description: "Gas for pre-verification steps (hex)",
  },
  {
    key: "maxFeePerGas",
    name: "Max Fee Per Gas",
    description: "Maximum fee per gas unit (hex, EIP-1559)",
  },
  {
    key: "maxPriorityFeePerGas",
    name: "Max Priority Fee Per Gas",
    description: "Maximum priority fee per gas (hex, EIP-1559)",
  },
  {
    key: "paymasterAndData",
    name: "Paymaster And Data",
    description: "Paymaster address and associated data (hex)",
  },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>("ai");
  const [manualType, setManualType] = useState<ManualType>("batch");
  const [aiInput, setAiInput] = useState<string>("");
  const [batchUserOps, setBatchUserOps] = useState<UserOperation[]>([
    {
      sender: "",
      nonce: "0x0",
      initCode: "0x",
      callData: "0x",
      callGasLimit: "0x0",
      verificationGasLimit: "0x0",
      preVerificationGas: "0x0",
      maxFeePerGas: "0x0",
      maxPriorityFeePerGas: "0x0",
      paymasterAndData: "0x",
    },
  ]);
  const [generatedCalldata, setGeneratedCalldata] = useState<string>("");
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        to: "0xRecipientAddress" as const, // Replace with actual EntryPoint for ERC-4337
        data: calldata as `0x${string}`,
        value: BigInt(0),
      });
      console.log("Transaction sent successfully");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const handleBatchConfirm = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    const calldata =
      "0x" + batchUserOps.map((op) => op.callData.slice(2)).join("");
    try {
      sendTransaction({
        to: "0xRecipientAddress" as const, // Replace with actual EntryPoint for ERC-4337
        data: calldata as `0x${string}`,
        value: BigInt(0),
      });
      console.log("Transaction sent successfully");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const addUserOp = () => {
    setBatchUserOps([
      ...batchUserOps,
      {
        sender: "",
        nonce: "0x0",
        initCode: "0x",
        callData: "0x",
        callGasLimit: "0x0",
        verificationGasLimit: "0x0",
        preVerificationGas: "0x0",
        maxFeePerGas: "0x0",
        maxPriorityFeePerGas: "0x0",
        paymasterAndData: "0x",
      },
    ]);
  };

  const updateUserOp = (
    index: number,
    field: keyof UserOperation,
    value: string
  ) => {
    const updatedUserOps = [...batchUserOps];
    updatedUserOps[index] = { ...updatedUserOps[index], [field]: value };
    setBatchUserOps(updatedUserOps);
  };

  return (
    <div className="App">
      <header>
        <h1>Crypto AI Assistant</h1>
        <div className="wallet-connect">
          <ConnectButton />
        </div>
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
          Manual Mode
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
          <div className="manual-type-toggle">
            <button
              onClick={() => setManualType("batch")}
              className={manualType === "batch" ? "active" : ""}
            >
              Batch Type
            </button>
            <button
              onClick={() => setManualType("intent")}
              className={manualType === "intent" ? "active" : ""}
            >
              Intent Type
            </button>
          </div>

          {manualType === "batch" ? (
            <div className="batch-mode">
              {batchUserOps.map((userOp, index) => (
                <div key={index} className="user-op">
                  <h3>User Operation #{index + 1}</h3>
                  {userOpFields.map((field) => (
                    <div key={field.key} className="field">
                      <label>
                        <strong>{field.name}</strong>
                        <p className="description">{field.description}</p>
                        {field.key === "callData" ||
                        field.key === "initCode" ||
                        field.key === "paymasterAndData" ? (
                          <textarea
                            value={userOp[field.key]}
                            onChange={(e) =>
                              updateUserOp(index, field.key, e.target.value)
                            }
                            placeholder={`${field.name} (hex)`}
                          />
                        ) : (
                          <input
                            value={userOp[field.key]}
                            onChange={(e) =>
                              updateUserOp(index, field.key, e.target.value)
                            }
                            placeholder={`${field.name} (hex)`}
                          />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={addUserOp}>Add Another UserOp</button>
              <button onClick={handleBatchConfirm}>
                Confirm Batch Transaction
              </button>
            </div>
          ) : (
            <div className="intent-mode">
              <p>Intent mode coming soon...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
