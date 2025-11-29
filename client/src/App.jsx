// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import { useState } from "react";
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox";
import Title3D from "./components/Title3D";
import Sidebar from "./components/Sidebar";
import ConsciousnessIndicator from "./components/ConsciousnessIndicator";

function App() {
  // Conversation history state
  const [conversations, setConversations] = useState([
    { id: 1, title: "First conversation", date: "Today" },
    { id: 2, title: "About consciousness", date: "Yesterday" },
  ]);
  const [activeConversationId, setActiveConversationId] = useState(1);
  
  // Consciousness engine state (will be updated by backend)
  const [activeEngine, setActiveEngine] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewChat = () => {
    const newId = Date.now();
    setConversations(prev => [
      { id: newId, title: "New conversation", date: "Now" },
      ...prev
    ]);
    setActiveConversationId(newId);
  };

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNewChat={handleNewChat}
      />
      <div className="app-container">
        <Title3D />
        <ConsciousnessIndicator 
          activeEngine={activeEngine}
          isProcessing={isProcessing}
        />
        <ChatBox 
          onProcessingChange={setIsProcessing}
          onEngineChange={setActiveEngine}
        />
      </div>
    </div>
  );
}

export default App;