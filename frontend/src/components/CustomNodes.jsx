// ==================== frontend/src/components/CustomNodes.jsx ====================
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export const HighScoreNode = memo(({ data }) => {
  const { user, onSelect } = data;
  
  return (
    <div
      onClick={() => onSelect(user)}
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
        border: '3px solid #059669',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'nodeAppear 0.5s ease-out, glow 2s ease-in-out infinite'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.3)';
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#fff', width: '12px', height: '12px' }} />
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          👑 {user.username}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          Age: {user.age} • Friends: {user.friends.length}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>Popularity</span>
        <span style={{ fontSize: '22px', fontWeight: '700' }}>
          ⭐ {user.popularityScore}
        </span>
      </div>
      
      <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
        {user.hobbies.slice(0, 2).join(', ')}
        {user.hobbies.length > 2 && '...'}
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#fff', width: '12px', height: '12px' }} />
    </div>
  );
});

export const LowScoreNode = memo(({ data }) => {
  const { user, onSelect } = data;
  
  return (
    <div
      onClick={() => onSelect(user)}
      style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
        border: '3px solid #2563eb',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'nodeAppear 0.5s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#fff', width: '12px', height: '12px' }} />
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {user.username}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          Age: {user.age} • Friends: {user.friends.length}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>Popularity</span>
        <span style={{ fontSize: '22px', fontWeight: '700' }}>
          {user.popularityScore}
        </span>
      </div>
      
      <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
        {user.hobbies.slice(0, 2).join(', ')}
        {user.hobbies.length > 2 && '...'}
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#fff', width: '12px', height: '12px' }} />
    </div>
  );
});

HighScoreNode.displayName = 'HighScoreNode';
LowScoreNode.displayName = 'LowScoreNode';

export const nodeTypes = {
  highScore: HighScoreNode,
  lowScore: LowScoreNode
};