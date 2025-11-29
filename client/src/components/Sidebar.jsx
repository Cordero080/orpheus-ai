import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, activeId, onSelect, onNewChat }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="toggle-icon">{isCollapsed ? '▶' : '◀'}</span>
      </button>

      {!isCollapsed && (
        <>
          {/* New chat button */}
          <button className="new-chat-btn" onClick={onNewChat}>
            <span className="plus-icon">+</span>
            <span>New Chat</span>
          </button>

          {/* Conversation list */}
          <div className="conversation-list">
            <div className="list-header">History</div>
            {conversations.length === 0 ? (
              <div className="empty-state">No conversations yet</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`conversation-item ${activeId === conv.id ? 'active' : ''}`}
                  onClick={() => onSelect(conv.id)}
                >
                  <span className="conv-icon">💬</span>
                  <span className="conv-title">{conv.title || 'Untitled'}</span>
                  <span className="conv-date">{conv.date}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
