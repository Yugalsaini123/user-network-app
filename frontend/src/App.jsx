// ==================== frontend/src/App.jsx ====================
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactFlowProvider } from 'reactflow';
import { fetchGraphData, undo, redo } from './store/userSlice';
import { setEditingUser } from './store/uiSlice';
import GraphCanvas from './components/GraphCanvas';
import Sidebar from './components/Sidebar';
import UserPanel from './components/UserPanel';
import ErrorBoundary from './components/ErrorBoundary';
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
        if (e.key === 'z') {
          e.preventDefault();
          dispatch(undo());
        } else if (e.key === 'y') {
          e.preventDefault();
          dispatch(redo());
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchGraphData());
  };

  const handleCreateUser = () => {
    dispatch(setEditingUser('new'));
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">🌐 User Network Graph</h1>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => dispatch(undo())}
              disabled={!canUndo}
              className="icon-button"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
            </button>
            
            <button
              onClick={() => dispatch(redo())}
              disabled={!canRedo}
              className="icon-button"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} />
            </button>
            
            <button
              onClick={handleRefresh}
              className="icon-button"
              title="Refresh"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
            
            <button
              onClick={handleCreateUser}
              className="primary-button"
            >
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

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;