import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CodeIcon from '@mui/icons-material/Code';
import useInView, { prefersReducedMotion } from '../../../hooks/useInView.jsx';

const userTestimonials = [
    {
        initials: 'AJ',
        color: '#6C8EFF',
        name: 'Alex Johnson',
        occupation: 'Student',
        testimonial: "ERUDITE helped me finally understand difficult topics by learning through challenges. Instead of passively watching lessons, I now solve tasks, get feedback, and see my progress grow every day.",
    },
    {
        initials: 'EC',
        color: '#B06EFF',
        name: 'Dr. Emily Carter',
        occupation: 'Instructor',
        testimonial: "As a course author, I appreciate how easily I can create challenges and track student submissions. The platform makes teaching interactive and allows me to give meaningful feedback efficiently.",
    },
    {
        initials: 'MR',
        color: '#4CAF50',
        name: 'Michael Rivera',
        occupation: 'Student',
        testimonial: "The ranking and points system keeps me motivated. I especially love that every challenge requires an explanation — it pushes me to actually understand what I'm doing instead of guessing.",
    },
    {
        initials: 'SL',
        color: '#FFB74D',
        name: 'Sofia Lee',
        occupation: 'Moderator',
        testimonial: "Managing content and reviewing reports on ERUDITE is simple and well-structured. The moderation tools help keep the learning environment positive and productive.",
    },
    {
        initials: 'JK',
        color: '#6C8EFF',
        name: 'Jonathan Kim',
        occupation: 'Course Author',
        testimonial: "Creating structured course modules and custom challenge types has been a smooth experience. ERUDITE gives me the flexibility I need to design great learning material.",
    },
    {
        initials: 'ST',
        color: '#B06EFF',
        name: 'Sarah Thompson',
        occupation: 'Student',
        testimonial: "I love how ERUDITE shows my progress visually. Seeing points, badges, and completed challenges makes studying feel rewarding and even fun.",
    },
];

const FEATURES = [
    { icon: <AutoStoriesIcon aria-hidden="true" />, title: 'Structured Courses', desc: 'Step-by-step lessons with a logical progression that actually sticks.' },
    { icon: <CodeIcon aria-hidden="true" />,        title: 'Code Challenges',   desc: 'Real code executed against test cases — not just multiple choice.' },
    { icon: <TrendingUpIcon aria-hidden="true" />,  title: 'Progress Tracking', desc: 'Points, completion rates, and rankings so you always know where you stand.' },
    { icon: <EmojiEventsIcon aria-hidden="true" />, title: 'Certificates',      desc: 'Earn a PDF certificate when you complete a course with a passing score.' },
];

function FeatureCard({ icon, title, desc, delay }) {
    const [ref, inView] = useInView();
    return (
        <Box
            ref={ref}
            sx={{
                flex: '1 1 200px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5,
                p: 3, borderRadius: 2,
                border: '1px solid rgba(108,142,255,0.1)',
                background: 'rgba(108,142,255,0.03)',
                transition: prefersReducedMotion
                    ? 'border-color 0.2s, box-shadow 0.2s'
                    : `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.2s, box-shadow 0.2s`,
                opacity: prefersReducedMotion ? 1 : (inView ? 1 : 0),
                transform: prefersReducedMotion ? 'none' : (inView ? 'translateY(0)' : 'translateY(28px)'),
                '&:hover': {
                    borderColor: 'rgba(108,142,255,0.28)',
                    boxShadow: '0 6px 28px rgba(108,142,255,0.1)',
                },
            }}
        >
            <Box sx={{
                p: 1.25, borderRadius: 1.5,
                background: 'rgba(108,142,255,0.1)',
                color: 'primary.light',
                display: 'flex',
                '& svg': { fontSize: '1.3rem' },
            }}>
                {icon}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{desc}</Typography>
        </Box>
    );
}

function TestimonialCard({ testimonial, delay }) {
    const [ref, inView] = useInView();
    return (
        <Grid ref={ref} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
            <Card
                variant="outlined"
                component="article"
                sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    flexGrow: 1, p: 0.5,
                    transition: prefersReducedMotion
                        ? 'box-shadow 0.2s, border-color 0.2s'
                        : `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms, box-shadow 0.2s, border-color 0.2s`,
                    opacity: prefersReducedMotion ? 1 : (inView ? 1 : 0),
                    transform: prefersReducedMotion ? 'none' : (inView ? 'translateY(0)' : 'translateY(32px)'),
                    '&:hover': {
                        borderColor: 'rgba(108,142,255,0.3)',
                        boxShadow: '0 8px 32px rgba(108,142,255,0.1)',
                    },
                }}
            >
                <CardContent sx={{ pb: 1 }}>
                    {/* Quote mark */}
                    <Typography aria-hidden="true" sx={{ fontSize: '2.5rem', lineHeight: 1, mb: 1, color: 'primary.light', opacity: 0.3, fontFamily: 'Georgia, serif' }}>
                        "
                    </Typography>
                    <Typography component="blockquote" variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, m: 0 }}>
                        {testimonial.testimonial}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, pb: 2, pt: 1 }}>
                    <Avatar sx={{
                        width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                        background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}99)`,
                        border: `2px solid ${testimonial.color}40`,
                        color: '#fff',
                    }}>
                        {testimonial.initials}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>
                            {testimonial.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {testimonial.occupation}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Grid>
    );
}

export default function Testimonials() {
    const [featureRef, featuresInView] = useInView();
    const [headerRef, headerInView] = useInView();

    return (
        <Container
            id="testimonials"
            sx={{
                pt: { xs: 4, sm: 8 },
                pb: { xs: 8, sm: 16 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 6, sm: 10 },
            }}
        >
            {/* ── Feature highlights strip ── */}
            <Box
                ref={featureRef}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
            >
                {FEATURES.map((f, i) => (
                    <FeatureCard key={f.title} {...f} delay={i * 100} />
                ))}
            </Box>

            {/* ── Testimonials ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 6 } }}>
                <Box
                    ref={headerRef}
                    sx={{
                        width: { sm: '100%', md: '60%' }, mx: 'auto', textAlign: 'center',
                        transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease, transform 0.6s ease',
                        opacity: prefersReducedMotion ? 1 : (headerInView ? 1 : 0),
                        transform: prefersReducedMotion ? 'none' : (headerInView ? 'translateY(0)' : 'translateY(20px)'),
                    }}
                >
                    <Typography component="h2" variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        What ERUDITE Users Say
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Hear from students, instructors, and moderators who use ERUDITE every day.
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {userTestimonials.map((t, i) => (
                        <TestimonialCard key={t.name} testimonial={t} delay={i * 80} />
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
