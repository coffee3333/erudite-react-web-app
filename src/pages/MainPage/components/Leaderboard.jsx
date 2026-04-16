import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTheme } from '@mui/material/styles';
import useLeaderboard from '../../../hooks/userHooks/useLeaderboard.jsx';
import useAuthStore from '../../../stores/authStore.jsx';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

const keyframes = `
@keyframes fireGlow {
    0%, 100% { box-shadow: 0 0 8px 2px rgba(255,140,0,0.4), 0 0 20px 4px rgba(255,60,0,0.2); }
    50%       { box-shadow: 0 0 14px 4px rgba(255,180,0,0.6), 0 0 30px 8px rgba(255,80,0,0.3); }
}
@keyframes fireGlowLight {
    0%, 100% { box-shadow: 0 0 8px 2px rgba(200,120,0,0.35), 0 0 18px 4px rgba(180,80,0,0.15); }
    50%       { box-shadow: 0 0 14px 4px rgba(220,150,0,0.5), 0 0 26px 8px rgba(200,100,0,0.25); }
}
@keyframes shimmerSilver {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
}
@keyframes shimmerBronze {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
}
`;

function RankBadge({ rank }) {
    if (rank <= 3) {
        return (
            <Box sx={{
                width: 32, height: 32, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${MEDAL_COLORS[rank - 1]}, ${MEDAL_COLORS[rank - 1]}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: `0 2px 8px ${MEDAL_COLORS[rank - 1]}55`,
            }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: rank === 1 ? '#7a5500' : rank === 2 ? '#555' : '#6b3a1f' }}>
                    {rank}
                </Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: 'text.secondary' }}>
                {rank}
            </Typography>
        </Box>
    );
}

function LeaderRow({ entry, isMe, isCurrentUser, isFirst }) {
    const highlight = isMe || isCurrentUser;
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    const firstBg         = isLight ? 'linear-gradient(90deg, rgba(255,180,0,0.08) 0%, rgba(255,180,0,0.04) 100%)' : 'linear-gradient(90deg, rgba(255,215,0,0.07) 0%, rgba(255,215,0,0.03) 100%)';
    const firstBgHover    = isLight ? 'linear-gradient(90deg, rgba(255,180,0,0.14) 0%, rgba(255,180,0,0.08) 100%)'  : 'linear-gradient(90deg, rgba(255,215,0,0.11) 0%, rgba(255,215,0,0.05) 100%)';
    const firstBorder     = isLight ? '1px solid rgba(255,180,0,0.35)' : '1px solid rgba(255,215,0,0.2)';
    const firstColor      = isLight ? '#B8750A' : '#FFD700';
    const firstShadow     = isLight ? 'none' : '0 0 12px rgba(255,215,0,0.35)';
    const firstAvatar     = isLight ? 'linear-gradient(135deg, #E6A817, #C8860A)' : 'linear-gradient(135deg, #FFD700, #FFA500)';
    const rowAnim = isFirst
        ? (isLight ? 'fireGlowLight 2.4s ease-in-out infinite' : 'fireGlow 2.4s ease-in-out infinite')
        : 'none';
    const shimmerColors = isLight
        ? 'linear-gradient(90deg, #C8860A 0%, #F5C842 40%, #E6A817 60%, #C8860A 100%)'
        : 'linear-gradient(90deg, #FFD700 0%, #FFF0A0 40%, #FFA500 60%, #FFD700 100%)';

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            px: 2, py: isFirst ? 1.75 : 1.25,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            background: isFirst ? firstBg : highlight ? 'rgba(108,142,255,0.09)' : 'transparent',
            border: isFirst ? firstBorder : highlight ? '1px solid rgba(108,142,255,0.25)' : '1px solid transparent',
            animation: rowAnim,
            transition: 'background 0.25s, border-color 0.25s',
            '&:hover': {
                background: isFirst ? firstBgHover : highlight ? 'rgba(108,142,255,0.13)' : 'rgba(108,142,255,0.04)',
            },
        }}>
            <RankBadge rank={entry.rank} />

            <Avatar
                src={entry.photo || undefined}
                sx={{
                    width: isFirst ? 40 : 32,
                    height: isFirst ? 40 : 32,
                    flexShrink: 0,
                    fontSize: '0.85rem', fontWeight: 700,
                    background: highlight
                        ? 'linear-gradient(135deg, #6C8EFF, #B06EFF)'
                        : isFirst ? firstAvatar : 'rgba(108,142,255,0.25)',
                    transition: 'width 0.2s, height 0.2s',
                    animation: isFirst ? (isLight ? 'fireGlowLight 2.4s ease-in-out infinite' : 'fireGlow 2.4s ease-in-out infinite') : 'none',
                }}
            >
                {entry.username?.[0]?.toUpperCase()}
            </Avatar>

            <Typography sx={{
                flex: 1,
                fontWeight: isFirst ? 800 : highlight ? 700 : 500,
                fontSize: isFirst ? '1rem' : '0.9rem',
                minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: isFirst ? firstColor : 'text.primary',
                textShadow: isFirst ? firstShadow : 'none',
                transition: 'color 0.2s',
            }}>
                {entry.username}
                {highlight && (
                    <Typography component="span" sx={{
                        ml: 1, fontSize: '0.72rem', fontWeight: 600, opacity: 0.75,
                        color: 'primary.light',
                        background: 'rgba(108,142,255,0.12)',
                        px: 0.6, py: 0.15, borderRadius: 1,
                    }}>
                        you
                    </Typography>
                )}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.4, flexShrink: 0 }}>
                <Typography sx={{
                    fontWeight: 800,
                    fontSize: isFirst ? '1.2rem' : '1.05rem',
                    ...(isFirst ? {
                        background: shimmerColors,
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmer 2.5s linear infinite',
                    } : entry.rank === 2 ? {
                        background: 'linear-gradient(90deg, #A0A0A0 0%, #E8E8E8 40%, #C0C0C0 60%, #A0A0A0 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmerSilver 2.5s linear infinite',
                    } : entry.rank === 3 ? {
                        background: 'linear-gradient(90deg, #A0622A 0%, #D4956A 40%, #CD7F32 60%, #A0622A 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'shimmerBronze 2.5s linear infinite',
                    } : {
                        background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }),
                }}>
                    {entry.total_points.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 600 }}>
                    pts
                </Typography>
            </Box>
        </Box>
    );
}

export default function Leaderboard() {
    const { data, loading, getLeaderboard } = useLeaderboard();
    const currentUsername = useAuthStore((s) => s.user?.username);
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    useEffect(() => {
        getLeaderboard();
    }, [getLeaderboard]);

    return (
        <Box sx={{ width: '100%' }}>
            <style>{keyframes}</style>
            <Container disableGutters sx={{ maxWidth: { xs: '100%', sm: 900, md: 900 } }}>
                {/* Section header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <EmojiEventsIcon sx={{ color: isLight ? '#C8860A' : '#FFD700', fontSize: '1.5rem' }} />
                    <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Leaderboard
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                            Top students by points earned
                        </Typography>
                    </Box>
                </Box>

                {/* Rows */}
                <Box sx={{
                    borderRadius: 2.5,
                    border: '1px solid rgba(108,142,255,0.15)',
                    background: 'rgba(108,142,255,0.03)',
                    backdropFilter: 'blur(12px)',
                    overflow: 'hidden',
                    px: 0.5, py: 0.5,
                    display: 'flex', flexDirection: 'column', gap: 0.25,
                }}>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton width="40%" height={18} />
                                <Box sx={{ ml: 'auto' }}>
                                    <Skeleton width={60} height={18} />
                                </Box>
                            </Box>
                        ))
                    ) : !data || data.leaderboard.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                No scores yet — be the first to complete a challenge!
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {data.leaderboard.map((entry, i) => (
                                <LeaderRow
                                    key={entry.username}
                                    entry={entry}
                                    isMe={entry.username === currentUsername}
                                    isFirst={i === 0}
                                />
                            ))}

                            {data.current_user && (
                                <>
                                    <Box sx={{ my: 0.5, mx: 2, borderTop: '1px dashed rgba(108,142,255,0.15)' }} />
                                    <LeaderRow entry={data.current_user} isCurrentUser />
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
