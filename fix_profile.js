const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/CandidateProfile.jsx', 'utf8');

// 1. Add import for useAuth
content = content.replace(
  "import CredentialStatus from '../components/CredentialStatus';",
  "import CredentialStatus from '../components/CredentialStatus';\nimport { useAuth } from '../context/AuthContext';"
);

// 2. Add useAuth hook
content = content.replace(
  "const CandidateProfile = () => {",
  "const CandidateProfile = () => {\n  const { user } = useAuth();"
);

// 3. Fix loading avatar
// Inside handleAvatarUpload:
content = content.replace(
  "if (profile?.user?.id) {",
  "if (user?.id) {"
);
content = content.replace(
  "localStorage.setItem(`avatar_${profile.user.id}`, reader.result);",
  "localStorage.setItem(`avatar_${user.id}`, reader.result);"
);

// Inside fetchProfile:
content = content.replace(
  "if (res.data.user?.id) {",
  "if (true) {"
);
content = content.replace(
  "setAvatar(localStorage.getItem(`avatar_${res.data.user.id}`));",
  "// Avatar is now loaded via a separate effect listening to 'user'"
);

// We should actually load the avatar whenever 'user' is available.
const avatarEffect = `
  useEffect(() => {
    if (user?.id) {
      setAvatar(localStorage.getItem(\`avatar_\${user.id}\`));
    }
  }, [user]);
`;

content = content.replace("useEffect(() => {\n    fetchProfile();\n  }, []);", `useEffect(() => {\n    fetchProfile();\n  }, []);\n${avatarEffect}`);

// 4. Fix rendering name
content = content.replace(
  "{profile?.user?.name && <h1 className=\"text-2xl font-bold text-slate-900 mb-2\">{profile.user.name}</h1>}",
  "{user?.name && <h1 className=\"text-2xl font-bold text-slate-900 mb-2\">{user.name}</h1>}"
);

fs.writeFileSync('frontend/src/pages/CandidateProfile.jsx', content);
