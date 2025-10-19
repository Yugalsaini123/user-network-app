// ==================== frontend/src/components/GraphCanvas.jsx ====================
import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  MiniMap,
  Panel,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, linkUsers, fetchGraphData, addHobbyToUser, unlinkUsers, saveToHistory } from '../store/userSlice.js';
import { setEditingUser, setSelectedEdge } from '../store/uiSlice.js';
import { nodeTypes } from './CustomNodes.jsx';
import { Unlink } from 'lucide-react';

const GraphCanvas = () => {
  const dispatch = useDispatch();
  const { users, edges: userEdges, loading } = useSelector((state) => state.users);
  const { selectedEdge } = useSelector((state) => state.ui);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  useEffect(() => {
    const newNodes = users.map((user, index) => ({
      id: user.id,
      type: 'userNode',
      position: {
        x: (index % 4) * 300 + 100,
        y: Math.floor(index / 4) * 200 + 100
      },
      data: {
        user,
        isHighScore: user.popularityScore > 5,
        onSelect: () => {
          dispatch(setSelectedUser(user));
          dispatch(setEditingUser(user.id));
        }
      }
    }));
    setNodes(newNodes);
  }, [users, dispatch, setNodes]);

  useEffect(() => {
    const newEdges = userEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: {
        stroke: selectedEdge === edge.id ? '#ef4444' : '#94a3b8',
        strokeWidth: selectedEdge === edge.id ? 4 : 3
      },
      type: 'straight'
    }));
    setEdges(newEdges);
  }, [userEdges, selectedEdge, setEdges]);

  const onConnect = useCallback(async (connection) => {
    if (connection.source && connection.target && connection.source !== connection.target) {
      try {
        dispatch(saveToHistory());
        await dispatch(linkUsers({
          userId: connection.source,
          targetUserId: connection.target
        })).unwrap();
        window.toast.success('🎉 Friendship created!');
        dispatch(fetchGraphData());
      } catch (error) {
        window.toast.error(error.message || 'Failed to link users');
      }
    }
  }, [dispatch]);

  const onEdgeClick = useCallback((event, edge) => {
    dispatch(setSelectedEdge(edge.id === selectedEdge ? null : edge.id));
  }, [dispatch, selectedEdge]);

  const handleUnlinkSelected = useCallback(async () => {
    if (!selectedEdge) return;
    
    const edge = userEdges.find(e => e.id === selectedEdge);
    if (!edge) return;

    if (window.confirm('Remove this friendship?')) {
      try {
        dispatch(saveToHistory());
        await dispatch(unlinkUsers({
          userId: edge.source,
          targetUserId: edge.target
        })).unwrap();
        window.toast.success('💔 Friendship removed!');
        dispatch(setSelectedEdge(null));
        dispatch(fetchGraphData());
      } catch (error) {
        window.toast.error(error.message || 'Failed to unlink users');
      }
    }
  }, [dispatch, selectedEdge, userEdges]);

  const onDrop = useCallback(async (event) => {
    event.preventDefault();
    const hobby = event.dataTransfer.getData('hobby');
    if (!hobby) return;

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });

    const targetNode = nodes.find(node => {
      const nodeWidth = 200;
      const nodeHeight = 150;
      return (
        position.x >= node.position.x &&
        position.x <= node.position.x + nodeWidth &&
        position.y >= node.position.y &&
        position.y <= node.position.y + nodeHeight
      );
    });

    if (targetNode) {
      try {
        dispatch(saveToHistory());
        await dispatch(addHobbyToUser({
          userId: targetNode.data.user.id,
          hobby
        })).unwrap();
        window.toast.success(`✨ Added "${hobby}" to ${targetNode.data.user.username}!`);
        dispatch(fetchGraphData());
      } catch (error) {
        window.toast.info(error.message || 'Failed to add hobby');
      }
    }
  }, [nodes, dispatch, project]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  if (loading && users.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ width: '60px', height: '60px', border: '6px solid rgba(255,255,255,0.3)', borderTop: '6px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const totalScore = users.reduce((sum, user) => sum + user.popularityScore, 0);
  const avgScore = users.length > 0 ? (totalScore / users.length).toFixed(1) : 0;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls />
        <MiniMap nodeColor={(node) => node.data?.isHighScore ? '#10b981' : '#3b82f6'} />
        
        <Panel position="top-right" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          minWidth: '200px'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '12px', fontSize: '16px' }}>📊 Network Stats</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Users:</span>
              <span style={{ fontWeight: '600' }}>{users.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Connections:</span>
              <span style={{ fontWeight: '600' }}>{edges.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
              <span>Avg Score:</span>
              <span style={{ fontWeight: '700', color: '#667eea' }}>{avgScore}</span>
            </div>
          </div>
        </Panel>

        {selectedEdge && (
          <Panel position="top-center" style={{
            background: 'rgba(239, 68, 68, 0.95)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '600' }}>Selected Connection</span>
              <button
                onClick={handleUnlinkSelected}
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Unlink size={16} />
                Remove
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;