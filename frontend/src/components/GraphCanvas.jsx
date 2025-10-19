// ==================== frontend/src/components/GraphCanvas.jsx ====================
import React, { useCallback, useEffect } from 'react';
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
import { setSelectedUser, linkUsers, fetchGraphData, addHobbyToUser } from '../store/userSlice';
import { setEditingUser } from '../store/uiSlice';
import { nodeTypes } from './CustomNodes';
import { toast } from 'react-toastify';
import { Users, TrendingUp } from 'lucide-react';

const GraphCanvas = () => {
  const dispatch = useDispatch();
  const { users, edges: userEdges, loading } = useSelector((state) => state.users);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  useEffect(() => {
    const newNodes = users.map((user, index) => ({
      id: user.id,
      type: user.popularityScore > 5 ? 'highScore' : 'lowScore',
      position: {
        x: (index % 4) * 300 + 100,
        y: Math.floor(index / 4) * 200 + 100
      },
      data: {
        user,
        onSelect: () => {
          dispatch(setSelectedUser(user));
          dispatch(setEditingUser(user.id));
        }
      },
      style: {
        cursor: 'pointer'
      }
    }));
    setNodes(newNodes);
  }, [users, dispatch]);

  useEffect(() => {
    const newEdges = userEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 3
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#94a3b8'
      }
    }));
    setEdges(newEdges);
  }, [userEdges]);

  const onConnect = useCallback(async (connection) => {
    if (connection.source && connection.target && connection.source !== connection.target) {
      try {
        await dispatch(linkUsers({
          userId: connection.source,
          targetUserId: connection.target
        })).unwrap();
        toast.success('🎉 Friendship created!');
        dispatch(fetchGraphData());
      } catch (error) {
        toast.error(error.message || 'Failed to link users');
      }
    } else {
      toast.error('Cannot connect user to themselves');
    }
  }, [dispatch]);

  const onDrop = useCallback(async (event) => {
    event.preventDefault();
    const hobby = event.dataTransfer.getData('hobby');
    if (!hobby) return;

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };
    const projectedPosition = project(position);

    const targetNode = nodes.find(node => {
      const nodeWidth = 200;
      const nodeHeight = 150;
      return (
        projectedPosition.x >= node.position.x &&
        projectedPosition.x <= node.position.x + nodeWidth &&
        projectedPosition.y >= node.position.y &&
        projectedPosition.y <= node.position.y + nodeHeight
      );
    });

    if (targetNode) {
      const user = targetNode.data.user;
      try {
        await dispatch(addHobbyToUser({
          userId: user.id,
          hobby
        })).unwrap();
        toast.success(`✨ Added "${hobby}" to ${user.username}!`);
        dispatch(fetchGraphData());
      } catch (error) {
        if (error.message?.includes('already has this hobby')) {
          toast.info(`ℹ️ ${user.username} already has "${hobby}"`);
        } else {
          toast.error(error.message || 'Failed to add hobby');
        }
      }
    } else {
      toast.info('💡 Drop a hobby directly onto a user node');
    }
  }, [nodes, dispatch, project]);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node double click for editing
  const onNodeDoubleClick = useCallback((event, node) => {
    dispatch(setSelectedUser(node.data.user));
    dispatch(setEditingUser(node.data.user.id));
  }, [dispatch]);

  if (loading && users.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255,255,255,0.3)',
          borderTop: '6px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'white', marginTop: '20px', fontSize: '18px', fontWeight: '600' }}>
          Loading your network...
        </p>
      </div>
    );
  }

  const totalScore = users.reduce((sum, user) => sum + user.popularityScore, 0);
  const avgScore = users.length > 0 ? (totalScore / users.length).toFixed(1) : 0;
  const totalConnections = edges.length;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} 
         onDrop={onDrop} 
         onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 3, stroke: '#94a3b8' }
        }}
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 3 }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#e2e8f0"
        />
        <Controls 
          style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}
        />
        <MiniMap 
          nodeColor={(node) => node.type === 'highScore' ? '#10b981' : '#3b82f6'}
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          position="bottom-right"
        />
        
        <Panel position="top-right" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          minWidth: '200px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Users size={20} color="#667eea" />
            <span style={{ fontWeight: '700', color: '#111827', fontSize: '16px' }}>Network Stats</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total Users:</span>
              <span style={{ fontWeight: '600', color: '#111827' }}>{users.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Connections:</span>
              <span style={{ fontWeight: '600', color: '#111827' }}>{totalConnections}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
              <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} />
                Avg Score:
              </span>
              <span style={{ fontWeight: '700', color: '#667eea' }}>{avgScore}</span>
            </div>
          </div>
        </Panel>

        {users.length === 0 && !loading && (
          <Panel position="top-center" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#6b7280', fontSize: '16px', fontWeight: '600' }}>
              👥 No users yet
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>
              Click "New User" to create your first user
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;