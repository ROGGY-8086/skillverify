const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/CandidateProfile.jsx', 'utf8');

// 1. Add handleAvatarUpload and state
const stateInjection = `  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
`;
content = content.replace('  const [profile, setProfile] = useState(null);', stateInjection);

const loadAvatarLogic = `      setProfile(res.data);
      if (res.data.user?.id) {
        setAvatar(localStorage.getItem(\`avatar_\${res.data.user.id}\`));
      }`;
content = content.replace('      setProfile(res.data);', loadAvatarLogic);

const uploadHandler = `
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        if (profile?.user?.id) {
          localStorage.setItem(\`avatar_\${profile.user.id}\`, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProfile = async () => {`;
content = content.replace('  const fetchProfile = async () => {', uploadHandler);

// 2. Modify avatar JSX
const originalAvatarJSX = `<div className="absolute -top-16 left-8 bg-white p-1.5 rounded-full">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <User className="h-12 w-12 text-slate-400" />
            </div>
          </div>`;

const newAvatarJSX = `<div className="absolute -top-20 left-8 bg-white p-1.5 rounded-full z-10">
            <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative group cursor-pointer">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-slate-400" />
              )}
              <label className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>`;
content = content.replace(originalAvatarJSX, newAvatarJSX);

// 3. Fix the margin-top overlapping
content = content.replace('<div className="mt-12 flex justify-between items-start">', '<div className="mt-20 flex justify-between items-start">');

// Write back
fs.writeFileSync('frontend/src/pages/CandidateProfile.jsx', content);
