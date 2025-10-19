// ==================== frontend/src/components/Sidebar.jsx ====================
import React, { useState, useMemo } from 'react';
import { Search, Tag, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { users } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');

  const allHobbies = useMemo(() => {
    const hobbiesSet = new Set();
    users.forEach(user => {
      user.hobbies.forEach(hobby => hobbiesSet.add(hobby));
    });
    return Array.from(hobbiesSet).sort();
  }, [users]);

  const filteredHobbies = useMemo(() => {
    if (!searchQuery) return allHobbies;
    return allHobbies.filter(hobby =>
      hobby.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allHobbies, searchQuery]);

  const onDragStart = (event, hobby) => {
    event.dataTransfer.setData('hobby', hobby);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{
      width: '300px',
      height: '100%',
      background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
      borderRight: '2px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '4px 0 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{ 
        padding: '24px', 
        borderBottom: '2px solid #e5e7eb',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={24} />
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>
            Hobbies
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
          Drag & drop onto user nodes
        </p>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} 
          />
          <input
            type="text"
            placeholder="Search hobbies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {filteredHobbies.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#9ca3af'
          }}>
            <Tag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontWeight: '500' }}>No hobbies found</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>
              {searchQuery ? 'Try a different search' : 'Add users to see hobbies'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredHobbies.map((hobby) => (
              <div
                key={hobby}
                draggable
                onDragStart={(e) => onDragStart(e, hobby)}
                style={{
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '2px solid #bae6fd',
                  borderRadius: '12px',
                  cursor: 'grab',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.color = 'white';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) icon.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = '#bae6fd';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                  e.currentTarget.style.color = '#1e40af';
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) icon.style.color = '#3b82f6';
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.cursor = 'grab';
                }}
              >
                <Tag size={18} style={{ color: '#3b82f6', transition: 'color 0.2s' }} />
                <span style={{ 
                  fontSize: '15px', 
                  fontWeight: '600',
                  color: '#1e40af',
                  transition: 'color 0.2s'
                }}>
                  {hobby}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '16px',
        borderTop: '2px solid #e5e7eb',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
          💡 Total Hobbies: {allHobbies.length}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;