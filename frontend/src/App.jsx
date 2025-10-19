// ==================== frontend/src/App.jsx ====================
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactFlowProvider } from 'reactflow';
import { fetchGraphData, undo, redo } from './store/userSlice.js';
import { setEditingUser } from './store/uiSlice.js';
import GraphCanvas from './components/GraphCanvas.jsx';
import Sidebar from './components/Sidebar.jsx';
import UserPanel from './components/UserPanel.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ToastContainer } from './components/CustomToast.jsx';
import { UserPlus, Undo2, Redo2, RefreshCw } from 'lucide-react';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const { loading, history, historyIndex } = useSelector((state) => state.users);
  const { showUserPanel } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchGraphData());
  }, [dispatch]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          dispatch(undo());
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          dispatch(redo());
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch]);

  const handleRefresh = () => dispatch(fetchGraphData());
  const handleCreateUser = () => dispatch(setEditingUser('new'));
  const canUndoAction = historyIndex > 0;
  const canRedoAction = historyIndex < history.length - 1;

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">🌐 User Network Graph</h1>
          
          <div className="header-actions">
            <button 
              onClick={() => dispatch(undo())} 
              disabled={!canUndoAction} 
              title="Undo (Ctrl+Z)"
              className="icon-button"
            >
              <Undo2 size={18} />
            </button>
            
            <button 
              onClick={() => dispatch(redo())} 
              disabled={!canRedoAction} 
              title="Redo (Ctrl+Y)"
              className="icon-button"
            >
              <Redo2 size={18} />
            </button>
            
            <button 
              onClick={handleRefresh} 
              disabled={loading} 
              title="Refresh"
              className="icon-button"
            >
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
            
            <button onClick={handleCreateUser} className="primary-button">
              <UserPlus size={18} />
              New User
            </button>
          </div>
        </header>

        <main className="app-main">
          <Sidebar />
          <div className="graph-container">
            <ReactFlowProvider>
              <GraphCanvas />
            </ReactFlowProvider>
          </div>
          {showUserPanel && <UserPanel />}
        </main>

        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
