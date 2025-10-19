// ==================== frontend/src/components/UserPanel.jsx ====================
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, UserPlus, Save, Trash2, Unlink } from 'lucide-react';
import { createUser, updateUser, deleteUser, unlinkUsers, fetchGraphData, setSelectedUser, saveToHistory } from '../store/userSlice.js';
import { setEditingUser, closePanel } from '../store/uiSlice.js';

const UserPanel = () => {
  const dispatch = useDispatch();
  const { selectedUser, users } = useSelector((state) => state.users);
  const { editingUser } = useSelector((state) => state.ui);
  
  const [formData, setFormData] = useState({ username: '', age: 18, hobbies: [''] });
  const isEditing = editingUser !== null && editingUser !== 'new';

  useEffect(() => {
    if (selectedUser && isEditing) {
      setFormData({
        username: selectedUser.username,
        age: selectedUser.age,
        hobbies: selectedUser.hobbies.length > 0 ? selectedUser.hobbies : ['']
      });
    } else {
      setFormData({ username: '', age: 18, hobbies: [''] });
    }
  }, [selectedUser, editingUser, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validHobbies = formData.hobbies.filter(h => h.trim() !== '');
    
    if (validHobbies.length === 0) {
      window.toast.error('Please add at least one hobby');
      return;
    }

    try {
      dispatch(saveToHistory());
      if (isEditing && selectedUser) {
        await dispatch(updateUser({
          id: selectedUser.id,
          data: { username: formData.username, age: formData.age, hobbies: validHobbies }
        })).unwrap();
        window.toast.success('User updated successfully!');
      } else {
        await dispatch(createUser({ username: formData.username, age: formData.age, hobbies: validHobbies })).unwrap();
        window.toast.success('User created successfully!');
      }
      dispatch(fetchGraphData());
      handleClose();
    } catch (error) {
      window.toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser || !window.confirm(`Delete ${selectedUser.username}?`)) return;
    try {
      dispatch(saveToHistory());
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      window.toast.success('User deleted!');
      dispatch(fetchGraphData());
      handleClose();
    } catch (error) {
      window.toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleUnlinkFriend = async (friendId) => {
    if (!selectedUser) return;
    try {
      dispatch(saveToHistory());
      await dispatch(unlinkUsers({ userId: selectedUser.id, targetUserId: friendId })).unwrap();
      window.toast.success('Friendship removed!');
      dispatch(fetchGraphData());
    } catch (error) {
      window.toast.error(error.message);
    }
  };

  const handleClose = () => {
    dispatch(setEditingUser(null));
    dispatch(setSelectedUser(null));
    dispatch(closePanel());
  };

  const addHobbyField = () => setFormData({ ...formData, hobbies: [...formData.hobbies, ''] });
  const updateHobby = (index, value) => {
    const newHobbies = [...formData.hobbies];
    newHobbies[index] = value;
    setFormData({ ...formData, hobbies: newHobbies });
  };
  const removeHobby = (index) => {
    const newHobbies = formData.hobbies.filter((_, i) => i !== index);
    setFormData({ ...formData, hobbies: newHobbies.length > 0 ? newHobbies : [''] });
  };

  if (!selectedUser && !editingUser) return null;

  const friendsList = isEditing && selectedUser ? selectedUser.friends.map(friendId => {
    return users.find(u => u.id === friendId);
  }).filter(Boolean) : [];

  return (
    <div style={{ width: '350px', height: '100%', background: 'white', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827' }}>
          {isEditing ? '✏️ Edit User' : '➕ New User'}
        </h2>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Username</label>
          <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Age</label>
          <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })} required min="1" max="150"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Hobbies</label>
            <button type="button" onClick={addHobbyField}
              style={{ padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              + Add
            </button>
          </div>
          {formData.hobbies.map((hobby, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input type="text" value={hobby} onChange={(e) => updateHobby(index, e.target.value)} placeholder="Enter hobby"
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
              {formData.hobbies.length > 1 && (
                <button type="button" onClick={() => removeHobby(index)}
                  style={{ padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedUser && (
          <>
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Popularity Score</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>⭐ {selectedUser.popularityScore}</div>
              </div>
            </div>

            {friendsList.length > 0 && (
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Friends ({friendsList.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {friendsList.map(friend => (
                    <div key={friend.id} style={{
                      padding: '12px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{friend.username}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Score: {friend.popularityScore}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnlinkFriend(friend.id)}
                        style={{
                          padding: '6px 10px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Remove friendship"
                      >
                        <Unlink size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          <button type="submit"
            style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isEditing ? <><Save size={16} />Update</> : <><UserPlus size={16} />Create</>}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete}
              style={{ padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserPanel;