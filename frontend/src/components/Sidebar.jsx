// ==================== frontend/src/components/Sidebar.jsx ====================
import React, { useState, useMemo } from 'react';
import { Search, Tag, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { users } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState('');

  const allHobbies = useMemo(() => {
    const hobbiesSet = new Set();
    users.forEach(user => user.hobbies.forEach(hobby => hobbiesSet.add(hobby)));
    return Array.from(hobbiesSet).sort();
  }, [users]);

  const filteredHobbies = useMemo(() => {
    if (!searchQuery) return allHobbies;
    return allHobbies.filter(hobby => hobby.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allHobbies, searchQuery]);

  const onDragStart = (event, hobby) => {
    event.dataTransfer.setData('hobby', hobby);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ width: '300px', height: '100%', background: '#ffffff', borderRight: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '24px', borderBottom: '2px solid #e5e7eb', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={24} />
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>Hobbies</h2>
        </div>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>Drag & drop onto user nodes</p>
      </div>

      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search hobbies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {filteredHobbies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <Tag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontWeight: '500' }}>No hobbies found</p>
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
                  gap: '10px'
                }}
              >
                <Tag size={18} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e40af' }}>{hobby}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
