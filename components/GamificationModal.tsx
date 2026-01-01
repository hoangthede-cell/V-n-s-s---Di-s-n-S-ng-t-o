
import React from 'react';
import { GamificationProfile, BadgeDefinition } from '../types';
import { getXpForNextLevel } from '../constants';

interface GamificationModalProps {
  onClose: () => void;
  profile: GamificationProfile;
  badgeDefinitions: BadgeDefinition[];
}

const GamificationModal: React.FC<GamificationModalProps> = ({ onClose, profile, badgeDefinitions }) => {
  const xpForNextLevel = getXpForNextLevel(profile.level);
  const progressPercentage = Math.min(100, (profile.xp / xpForNextLevel) * 100);

  const unlockedBadges = badgeDefinitions.filter(b => profile.unlockedBadges.includes(b.id));
  const lockedBadges = badgeDefinitions.filter(b => !profile.unlockedBadges.includes(b.id));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b sticky top-0 bg-white/80 backdrop-blur-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 font-serif">Thành tích học tập</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700">Cấp độ {profile.level}</span>
              <span className="text-xs font-mono text-slate-500">{profile.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Còn <strong>{Math.max(0, xpForNextLevel - profile.xp)} XP</strong> nữa để lên cấp {profile.level + 1}!
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3">Huy hiệu đã đạt được</h3>
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-bold text-green-800">{badge.name}</h4>
                      <p className="text-xs text-green-700">{badge.description(badge.threshold)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic text-center py-4">Chưa có huy hiệu nào. Hãy tích cực tương tác nhé!</p>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold text-slate-800 mb-3">Huy hiệu chờ khám phá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedBadges.map(badge => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-slate-100 border border-slate-200 rounded-lg filter grayscale opacity-70">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-500">{badge.name}</h4>
                    <p className="text-xs text-slate-500">{badge.description(badge.threshold)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationModal;
