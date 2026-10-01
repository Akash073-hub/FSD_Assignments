import './App.css';
import { useMemo, useState } from 'react';
import {
  Bell, ChevronLeft, ChevronRight, Gamepad2, Heart, MessageCircle,
  MoreVertical, Play, Search, Settings, Share2, Sparkles, Star, UserRound,
  Volume2, X
} from 'lucide-react';

const streams = [
  { id: 1, creator: 'LunaPlays', game: 'Stardew Valley', viewers: '12.4K', title: 'Building the coziest farm in Pelican Town', color: 'lavender', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=47' },
  { id: 2, creator: 'PixelPilot', game: 'Cyberpunk 2077', viewers: '8.8K', title: 'Night City after dark | no spoilers', color: 'orange', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 3, creator: 'MikoMakes', game: 'Just Chatting', viewers: '5.2K', title: 'Designing a tiny room from scratch', color: 'blue', image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=32' },
  { id: 4, creator: 'RexArena', game: 'League of Legends', viewers: '21.1K', title: 'Road to challenger - climbing all night', color: 'red', image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=68' },
  { id: 5, creator: 'OrbitLive', game: 'Music', viewers: '3.7K', title: 'Late night synth sessions', color: 'pink', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 6, creator: 'TheCraftRoom', game: 'Minecraft', viewers: '6.9K', title: 'Hardcore survival, day 43', color: 'green', image: 'https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=800&q=80', avatar: 'https://i.pravatar.cc/80?img=25' },
];

const followed = [
  { name: 'LunaPlays', game: 'Stardew Valley', viewers: '12.4K', avatar: streams[0].avatar },
  { name: 'PixelPilot', game: 'Cyberpunk 2077', viewers: '8.8K', avatar: streams[1].avatar },
  { name: 'MikoMakes', game: 'Just Chatting', viewers: '5.2K', avatar: streams[2].avatar },
  { name: 'RexArena', game: 'League of Legends', viewers: '21.1K', avatar: streams[3].avatar },
  { name: 'NovaNerd', game: 'The Finals', viewers: 'offline', avatar: 'https://i.pravatar.cc/80?img=44' },
];

const chatSeed = [
  ['orbiting_amy', 'this build is so cozy omg'], ['KaiWasHere', 'the lighting is incredible'],
  ['pixel_pete', 'hello everyone!'], ['MochiMochi', 'Luna is on fire today'], ['joystickjules', 'what platform are you on?']
];

function StreamCard({ stream, onSelect }) {
  return <article className="stream-card" onClick={() => onSelect(stream)} tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onSelect(stream)}>
    <div className="thumbnail-wrap"><img src={stream.image} alt="" /><span className="live-badge">LIVE</span><span className="viewer-badge"><span className="red-dot" /> {stream.viewers}</span></div>
    <div className="stream-details"><img className="avatar" src={stream.avatar} alt="" /><div><h3>{stream.title}</h3><p>{stream.creator}</p><p>{stream.game}</p></div><MoreVertical size={16} className="muted-icon" /></div>
  </article>;
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [following, setFollowing] = useState(false);
  const [chat, setChat] = useState(chatSeed);
  const [message, setMessage] = useState('');
  const filteredStreams = useMemo(() => streams.filter((stream) => `${stream.creator} ${stream.game} ${stream.title}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setChat([...chat, ['you', message.trim()]]);
    setMessage('');
  };

  return (
    <div className="twitch-app">
      <header className="topbar"><button className="brand" onClick={() => setSelected(null)} aria-label="Go to home"><span className="brand-mark"><span /><span /><span /></span><strong>Twitch</strong></button><button className="browse-button">Browse</button><button className="more-button"><MoreVertical size={20} /></button><div className="top-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><kbd>⌘ K</kbd></div><div className="top-actions"><button aria-label="Notifications"><Bell size={19} /></button><button aria-label="Messages"><MessageCircle size={19} /></button><button aria-label="Settings"><Settings size={19} /></button><button className="user-button" aria-label="Profile"><img src="https://i.pravatar.cc/80?img=11" alt="Profile" /></button></div></header>
      <div className="workspace"><aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="side-title"><span>For you</span><button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button></div><div className="side-section"><div className="side-label">FOLLOWED CHANNELS</div>{followed.map((channel) => <button className="channel-row" key={channel.name} onClick={() => setSelected(streams.find((stream) => stream.creator === channel.name) || null)}><img src={channel.avatar} alt="" /><span className="channel-info"><strong>{channel.name}</strong><small>{channel.game}</small></span>{channel.viewers === 'offline' ? <span className="offline-dot" /> : <span className="channel-viewers"><span className="red-dot" />{channel.viewers}</span>}</button>)}</div><div className="side-section discover"><div className="side-label">DISCOVER</div><button className="channel-row"><span className="discover-icon"><Sparkles size={16} /></span><span className="channel-info"><strong>Categories</strong><small>Explore new interests</small></span></button><button className="channel-row"><span className="discover-icon"><Gamepad2 size={16} /></span><span className="channel-info"><strong>Browse games</strong><small>Find your next watch</small></span></button></div><div className="sidebar-bottom"><span>© 2025 Streamly</span><span>About · Help · Privacy</span></div></aside>
        <main className="main-content">{selected ? <section className="watch-view"><div className="watch-player"><img src={selected.image} alt="Stream preview" /><div className="player-overlay"><div className="player-top"><span className="live-badge">LIVE</span><span><MoreVertical size={19} /></span></div><div className="player-center"><button><Play fill="currentColor" size={30} /></button></div><div className="player-controls"><span><Play size={17} fill="currentColor" /><Volume2 size={17} /></span><span><span className="quality">720p</span> <MoreVertical size={17} /></span></div></div></div><div className="watch-meta"><div className="watch-identity"><img className="avatar large" src={selected.avatar} alt="" /><div><h1>{selected.creator}</h1><p>{selected.game} <span>·</span> {selected.viewers} viewers</p></div></div><div className="watch-actions"><button className={`follow-button ${following ? 'following' : ''}`} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</button><button className="icon-button"><Share2 size={17} /></button><button className="icon-button"><MoreVertical size={17} /></button></div></div><div className="stream-tabs"><button className="active">About</button><button>Schedule</button><button>Videos</button></div><div className="about-stream"><h2>{selected.title}</h2><p>Welcome to the Twitch stream. Grab a seat, say hello, and enjoy the good vibes.</p><div><span><Star size={15} fill="currentColor" /> {selected.game}</span><span><Heart size={15} /> Followed by 4.2K people</span></div></div></section> : <><section className="welcome"><div><span className="eyebrow">WELCOME BACK</span><h1>What are you<br /><em>watching today?</em></h1><p>Catch the latest streams from creators you love and discover something new.</p></div><div className="welcome-art"><div className="art-circle one" /><div className="art-circle two" /><div className="art-card"><Play fill="currentColor" size={26} /><span>LIVE NOW</span></div></div></section><section className="section-block"><div className="section-header"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Live channels</h2></div><button className="view-all">View all <ChevronRight size={16} /></button></div><div className="stream-grid">{filteredStreams.map((stream) => <StreamCard key={stream.id} stream={stream} onSelect={setSelected} />)}</div>{!filteredStreams.length && <div className="no-results">No live channels found for “{query}”.</div>}</section><section className="section-block category-section"><div className="section-header"><div><span className="eyebrow">EXPLORE YOUR INTERESTS</span><h2>Popular categories</h2></div></div><div className="category-grid"><div className="category-card purple"><Gamepad2 size={27} /><strong>Games</strong><span>2.4M viewers</span></div><div className="category-card gold"><Sparkles size={27} /><strong>Just Chatting</strong><span>1.1M viewers</span></div><div className="category-card teal"><Heart size={27} /><strong>Music</strong><span>384K viewers</span></div><div className="category-card rose"><UserRound size={27} /><strong>Creative</strong><span>192K viewers</span></div></div></section></>}</main>
        {selected && <aside className="chat-panel"><div className="chat-header"><strong>Stream Chat</strong><button><X size={17} /></button></div><div className="chat-messages">{chat.map(([name, text], index) => <p key={`${name}-${index}`}><strong className={`name-color color-${index % 5}`}>{name}</strong> {text}</p>)}</div><form className="chat-input" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Send a message" /><button type="submit"><Play size={16} fill="currentColor" /></button></form><small className="chat-note">Be kind. Respect others.</small></aside>}
      </div>
    </div>
  );
}

export default App;
