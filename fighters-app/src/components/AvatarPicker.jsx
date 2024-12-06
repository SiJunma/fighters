import React from 'react';

function AvatarPicker({ onSelect }) {
  const avatars = Array.from({ length: 16 }, (_, i) => `av-${i + 1}.png`);

  return (
    <div className="d-flex gap-4 flex-wrap justify-content-center">
      {avatars.map((avatar) => (
        <div className="d-flex flex-column gap-1 avCard" key={avatar}><img
          src={`./images/${avatar}`}
          alt="avatar"
          className="d-block rounded-circle object-fit-cover"
          width="120"
          height="120"
          onClick={() => onSelect(avatar)} // Выбор аватара
          style={{ cursor: 'pointer' }}
        /></div>
      ))}
    </div>
  );
}

export default AvatarPicker;
