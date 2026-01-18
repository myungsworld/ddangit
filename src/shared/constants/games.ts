import { GameMeta } from '../types';

/**
 * 게임 레지스트리 - Single Source of Truth
 *
 * 새 게임 추가 시 여기 + registry.tsx에 등록하면 자동으로:
 * - 메인 페이지 게임 목록
 * - sitemap.xml
 * - 홍보 메시지 (Twitter/Bluesky)
 * - SEO 메타데이터
 * - 게임 페이지 (동적 라우트)
 * - 게임 가이드 페이지
 *
 * 추가로 필요한 작업:
 * - src/games/[game-id]/ 폴더 생성
 * - src/games/registry.tsx에 컴포넌트 등록
 * - src/shared/i18n/ko.json, en.json 번역 추가
 */
export const GAMES: GameMeta[] = [
  {
    id: 'sand-tetris',
    name: 'Sand Tetris',
    description: 'Tetris with sand physics',
    icon: '🧱',
    path: '/games/sand-tetris',
    color: '#D97706',
    estimatedTime: '3m',
    seo: {
      title: 'Sand Tetris | ddangit',
      description: 'Tetris with sand physics! Connect same colors to clear.',
    },
    guide: {
      introduction:
        'Sand Tetris is a unique twist on the classic Tetris game that combines traditional block-stacking gameplay with realistic sand physics. Instead of solid blocks that lock into place, the pixels in Sand Tetris behave like grains of sand, falling and settling naturally according to gravity.',
      howToPlay: [
        'Blocks fall from the top of the screen automatically at a steady pace',
        'Use the left and right arrow keys on desktop, or swipe left/right on mobile to move blocks horizontally',
        'Press the up arrow key or tap the screen to rotate blocks 90 degrees clockwise',
        'When blocks land, they break apart into individual colored pixels that behave like sand',
        'Connect 8 or more same-colored pixels horizontally in a row to clear them and earn points',
        'The game ends when the sand pile reaches the top of the screen',
      ],
      scoring: [
        'Each pixel cleared awards base points depending on your current level',
        'Chain reactions occur when clearing pixels causes others to fall and create new matches - these award bonus multiplier points',
        'Every 1000 points advances you to the next level, which increases game speed and introduces new colors',
        'Combo clears (multiple simultaneous matches) give exponentially more points',
        'The maximum theoretical multiplier is 10x for expert-level chain reactions',
      ],
      tips: [
        'Plan ahead - think about where colors will connect before the block lands',
        'Keep the board as flat as possible to maintain visibility and options',
        "Don't let one side get too high - asymmetric piles limit your placement options",
        'Use gravity to your advantage - strategic placement can trigger satisfying chain reactions',
        'Clear existing colors before new ones are introduced at higher levels',
        'The I-shaped (long) blocks are your best friends for creating horizontal connections',
        'Watch for opportunities to set up multi-step chain reactions',
      ],
      history:
        'Sand Tetris draws inspiration from both the original Tetris, created by Soviet software engineer Alexey Pajitnov in 1985, and modern physics-based puzzle games. The concept of combining falling blocks with particle physics emerged in the 2000s with games like "Falling Sand" browser games. This version brings that satisfying sand simulation to the classic Tetris formula, creating a fresh experience that feels both familiar and innovative. The sand physics add an element of unpredictability that makes each game unique.',
      strategies: [
        'The Flat Foundation Strategy: Focus on keeping your pile as level as possible. This gives you maximum flexibility for placing any block type and creates more opportunities for horizontal color matches.',
        'The Color Grouping Method: Try to concentrate same colors in specific areas of the board. When you finally connect them, you will clear large sections at once for massive point bonuses.',
        'Chain Reaction Setup: Advanced players intentionally build unstable color arrangements that will cascade when triggered. Place colors so that clearing one group causes another to fall into place.',
        'The Emergency Clear: When the pile gets dangerously high, focus on clearing ANY colors possible rather than waiting for perfect setups. Survival beats optimization.',
        'Edge Management: Keep the edges of your pile slightly lower than the center. This creates a bowl shape that naturally funnels sand toward potential matches.',
      ],
      faq: [
        {
          question: 'Why do my blocks sometimes not rotate?',
          answer:
            'Blocks cannot rotate if there is not enough space around them. Try moving the block left or right first to create clearance, then attempt rotation again.',
        },
        {
          question: 'What happens when sand pixels are the same color but not in a horizontal line?',
          answer:
            'Only horizontal connections of 8 or more same-colored pixels will clear. Vertical or diagonal arrangements do not count, so focus on building horizontal rows.',
        },
        {
          question: 'How do chain reactions work exactly?',
          answer:
            'When you clear pixels, the sand above falls down due to gravity. If this falling sand creates new horizontal matches of 8+ same-colored pixels, those clear too, and the process repeats.',
        },
        {
          question: 'Is there a maximum level?',
          answer:
            'The game continues indefinitely with increasing speed and colors. Most players find the game becomes extremely challenging around level 10-15.',
        },
      ],
      funFacts: [
        'The original Tetris has been played by an estimated 520 million people worldwide',
        'Sand physics in games require calculating interactions between thousands of individual particles every frame',
        'The satisfying feeling of watching sand settle is related to the psychological concept of "visual completion"',
        'Professional Tetris players can recognize and place blocks in under 0.5 seconds',
      ],
    },
  },
  {
    id: 'block-blast',
    name: 'Block Blast',
    description: 'Clear rows and columns',
    icon: '🧩',
    path: '/games/block-blast',
    color: '#8B5CF6',
    estimatedTime: '3m',
    seo: {
      title: 'Block Blast | ddangit',
      description: 'Place blocks to complete rows and columns!',
    },
    guide: {
      introduction:
        'Block Blast is an addictive puzzle game where you strategically place various shaped blocks on an 8x8 grid. Clear rows and columns by filling them completely, and chain multiple clears together for massive combo bonuses. Simple to learn but challenging to master!',
      howToPlay: [
        'You are presented with 3 random blocks at a time at the bottom of the screen',
        'Drag and drop each block onto the 8x8 grid - blocks cannot overlap with existing pieces',
        'When you completely fill a row or column with blocks, that entire line clears automatically',
        'You must place all 3 blocks before receiving 3 new ones',
        'The game ends when you cannot legally place any of your remaining blocks on the grid',
        'Cleared spaces become available again for new block placements',
      ],
      scoring: [
        'Each block placed awards points based on the number of cells it occupies (1 point per cell)',
        'Clearing a single line awards 10 bonus points',
        'Clearing multiple lines simultaneously triggers a combo multiplier',
        '2 lines at once = 2x multiplier (40 points), 3 lines = 3x (90 points), and so on',
        'The theoretical maximum is clearing 16 lines at once (8 rows + 8 columns) for incredible scores',
        'Your high score is saved locally so you can track your improvement over time',
      ],
      tips: [
        'Always keep space for the longest blocks (5-cell straight pieces) - running out of room for these is the most common way to lose',
        'Try to set up situations where placing one block clears multiple lines simultaneously',
        "Avoid filling corners too quickly - corner cells are the hardest to clear since they're only part of one row and one column",
        'Plan 2-3 moves ahead by looking at all 3 available blocks before placing any',
        'Sometimes leaving a gap is better than filling it with the wrong piece',
        'Focus on clearing lines consistently rather than holding out for perfect combos',
        'The center of the board is more flexible than edges - prioritize keeping it clear',
      ],
      history:
        'Block Blast belongs to the family of block puzzle games that evolved from classic Tetris. Unlike Tetris where blocks fall continuously, Block Blast gives players time to think and plan, making it more of a pure puzzle experience. The 8x8 grid format became popular in the 2010s with mobile games, offering bite-sized puzzle sessions perfect for casual gaming. This genre has proven incredibly popular, with similar games accumulating billions of downloads worldwide.',
      strategies: [
        'The Corner Avoidance Strategy: Treat the four corners of the grid as danger zones. Every cell you place in a corner is one step closer to getting stuck. Build from the center outward when possible.',
        'The Line Preparation Method: Before placing blocks, identify which rows or columns are closest to completion. Prioritize placements that advance multiple lines toward completion simultaneously.',
        'The Big Block Buffer: Always mentally reserve space for 5-cell and L-shaped blocks. If you see a large empty rectangle, resist filling it with small pieces - you will need that space.',
        'The Symmetry Approach: Try to keep your grid roughly symmetrical. Lopsided boards create dead zones where only specific block shapes can fit.',
        'The Emergency Clear: When space gets tight, focus entirely on completing ANY line possible, even if it means suboptimal placement. A cleared line creates options.',
        'The Preview Planning: Look at all 3 blocks before placing any. Sometimes the optimal order is not first-to-last.',
      ],
      faq: [
        {
          question: 'Can I rotate blocks before placing them?',
          answer:
            'No, blocks in Block Blast have fixed orientations. This is intentional - working with the shapes you are given is part of the challenge.',
        },
        {
          question: 'What is the highest possible score?',
          answer:
            'There is no theoretical maximum score since the game continues until you cannot place blocks. Top players have achieved scores in the tens of thousands through consistent combo chains.',
        },
        {
          question: 'Why did I get the same block shape multiple times in a row?',
          answer:
            'Block selection is random, so streaks of similar shapes can occur. This randomness is part of what makes each game unique and tests your adaptability.',
        },
        {
          question: 'Is there a way to skip or swap blocks?',
          answer:
            'No, you must place all 3 blocks you are given before receiving new ones. This forces strategic thinking about placement order.',
        },
      ],
      funFacts: [
        'The 8x8 grid has 64 cells - the same number as a chess board',
        'Block puzzle games are recommended by cognitive scientists for maintaining mental sharpness',
        'The average Block Blast session lasts about 3-5 minutes, making it perfect for short breaks',
        'Studies show puzzle games can improve spatial reasoning and planning skills',
      ],
    },
  },
  {
    id: 'reaction-speed',
    name: 'Reaction',
    description: 'Test your reflexes',
    icon: '⚡',
    path: '/games/reaction-speed',
    color: '#10B981',
    estimatedTime: '30s',
    seo: {
      title: 'Reaction Speed Test | ddangit',
      description: 'Test your reaction speed! How fast can you react?',
    },
    guide: {
      introduction:
        'The Reaction Speed Test is a scientific way to measure your reflexes. This test measures the time between a visual stimulus (the screen changing color) and your physical response (tapping the screen). Your reaction time is displayed in milliseconds, giving you precise feedback on your reflexes.',
      howToPlay: [
        'Click or tap the screen to begin the test - the screen will turn red',
        'Wait patiently while the screen remains red - the wait time is randomized to prevent anticipation',
        'The moment the screen turns green, tap as quickly as possible',
        'Your reaction time is instantly calculated and displayed in milliseconds (ms)',
        'If you tap while the screen is still red, you will see "Too Early!" and must restart',
        'Try multiple times to get your best score - your fastest time is saved',
      ],
      scoring: [
        'Under 150ms: Exceptional - You have elite-level reflexes comparable to professional athletes and esports players',
        '150-200ms: Excellent - Your reaction speed is significantly faster than average, indicating sharp reflexes',
        '200-250ms: Above Average - You react faster than most people, showing good cognitive processing speed',
        '250-300ms: Average - This is the typical human reaction time range, nothing to worry about',
        '300-350ms: Below Average - Your reactions are slightly slower than typical, but can be improved with practice',
        'Over 350ms: Consider factors like fatigue, distraction, or device lag that might be affecting your results',
      ],
      tips: [
        'Keep your finger hovering just above the screen, ready to tap - minimizing physical movement distance improves times',
        'Focus on the center of the screen where the color change is most visible',
        'Take a deep breath before starting to center yourself and reduce anxiety',
        'Find a quiet environment free from distractions - background noise can slow your reactions',
        'Practice regularly to establish your baseline and track improvement over time',
        'Try testing at different times of day - most people are faster in the late morning',
        'Ensure you are well-rested - fatigue significantly impacts reaction time',
        'Caffeine can temporarily improve reaction times by 10-20ms for some people',
      ],
      history:
        'Reaction time testing has been used by scientists since the 1800s to study human cognition. Dutch physiologist Franciscus Donders pioneered mental chronometry in the 1860s, using reaction time to study the speed of mental processes. Today, reaction tests are used in sports science, psychology research, driver testing, and video game training. The average human visual reaction time is around 250ms, though this varies based on age, alertness, and practice.',
      strategies: [
        'The Anticipation Technique: While you should never click before green, you can mentally prepare by building anticipation. Think of it like a sprinter waiting for the starting gun.',
        'The Rhythm Method: After several attempts, you might notice patterns in the wait time. However, be careful - anticipating too much leads to false starts.',
        'The Relaxation Approach: Paradoxically, being too tense can slow you down. Keep your muscles relaxed but ready, like a coiled spring.',
        'The Focus Point: Pick a specific point in the center of the screen to focus on. Peripheral vision is slower than central vision.',
        'The Single Attempt Reset: If you make a mistake (too early), take a moment to reset mentally before trying again. Frustration slows reactions.',
      ],
      faq: [
        {
          question: 'Why is my reaction time different each attempt?',
          answer:
            'This is completely normal. Human reaction time varies by 20-50ms between attempts due to factors like attention fluctuation, physical readiness, and neural processing variations. Track your average over 10+ attempts for a more accurate measure.',
        },
        {
          question: 'Can I actually improve my reaction time with practice?',
          answer:
            'Yes, but within limits. Studies show regular practice can improve reaction times by 10-20%. However, there is a biological floor determined by nerve conduction speed that cannot be exceeded.',
        },
        {
          question: 'Does age affect reaction time?',
          answer:
            'Yes. Reaction time typically peaks in your early 20s and gradually slows with age. However, experienced individuals can partially compensate through anticipation and pattern recognition.',
        },
        {
          question: 'Why do I sometimes react faster than 150ms?',
          answer:
            'Very fast times (under 150ms) are often due to anticipation rather than pure reaction. True human reaction to an unexpected visual stimulus rarely drops below 150ms due to biological limitations of neural signal transmission.',
        },
      ],
      funFacts: [
        'The fastest recorded human reaction time to a visual stimulus is around 120ms, achieved under laboratory conditions',
        'Professional baseball players react to a 90mph fastball in approximately 400ms - but they start predicting the pitch before it is thrown',
        'Fighter pilots undergo extensive reaction time training and typically score under 200ms',
        'Your brain takes about 13ms just to process the visual information from your eyes',
        'Audio reaction times are typically 20-40ms faster than visual reaction times',
      ],
    },
  },
  {
    id: 'color-chain',
    name: 'Color Chain',
    description: 'Combo chain game',
    icon: '🔗',
    path: '/games/color-chain',
    color: '#F59E0B',
    estimatedTime: '30s',
    seo: {
      title: 'Color Chain | ddangit',
      description: 'Tap same colors for 2x combos! Level up to unlock new colors.',
    },
    guide: {
      introduction:
        'Color Chain is a fast-paced color matching game that tests your visual recognition and pattern-building skills. The goal is simple: tap circles that match the target color. But the real challenge lies in building chains - tapping the same color consecutively to earn massive combo multipliers!',
      howToPlay: [
        'Multiple colored circles appear randomly on the screen',
        'Look at the target color indicator at the top of the screen',
        'Tap any circle that matches the current target color',
        'When you tap correctly, the target changes to a new color',
        'Tapping the same color consecutively builds your combo chain and activates a 2x score multiplier',
        'Tapping a wrong color breaks your chain and resets the multiplier',
        'As you score points, you level up and new colors are introduced to the game',
        'The game runs on a timer - score as many points as possible before time runs out',
      ],
      scoring: [
        'Each correct tap awards 10 base points',
        'Consecutive same-color taps activate a 2x multiplier (20 points per tap)',
        'The longer your chain, the more points you accumulate with the multiplier',
        'Level up bonuses award extra points when you reach a new level',
        'Fast consecutive taps (under 0.5 seconds apart) can earn speed bonuses',
        'Breaking a long chain costs you all accumulated multiplier potential',
      ],
      tips: [
        'Focus on building long chains of the same color rather than quickly tapping different colors',
        'Accuracy is more important than speed - a broken chain costs more points than a slow tap',
        'When new colors are introduced at higher levels, take a moment to recalibrate your visual recognition',
        'Develop peripheral vision to spot matching colors across the entire screen quickly',
        'Try to anticipate where same-colored circles are clustered for efficient chaining',
        'If you see multiple circles of the same color, mentally plan your tapping order',
        'Stay calm when your chain breaks - panicking leads to more mistakes',
      ],
      history:
        'Color matching games have been a staple of cognitive training and entertainment since the early days of video games. The concept of chain-building for bonus points originated in puzzle games like Puyo Puyo and Puzzle Fighter in the 1990s. Color Chain modernizes this concept for touch screens, combining the satisfaction of chain reactions with the quick-fire gameplay popular in mobile gaming. The game also incorporates elements of visual search tasks used in psychology research.',
      strategies: [
        'The Color Cluster Strategy: Instead of randomly searching for colors, quickly scan the screen for clusters of same-colored circles. These clusters let you build chains efficiently.',
        'The Zone Defense: Mentally divide the screen into zones. When the target color appears, quickly identify which zone has the most matching circles and focus there.',
        'The Chain Priority Method: When you see multiple matching colors, prioritize continuing your current chain color over switching to a different match. The multiplier is worth more than the speed.',
        'The Level Transition Pause: When approaching a level up, slow down slightly. New colors appearing can cause disorientation, and a brief adjustment period prevents chain breaks.',
        'The Rhythm Approach: Find a tapping rhythm that balances speed and accuracy. Too fast leads to errors; too slow wastes time. A steady, confident pace wins.',
      ],
      faq: [
        {
          question: 'How does the 2x multiplier work exactly?',
          answer:
            'When you tap circles of the same color consecutively, your score multiplier doubles to 2x. This means each correct tap in the chain is worth double points. The multiplier stays active as long as you keep tapping the same color. One wrong tap resets it to 1x.',
        },
        {
          question: 'What triggers a level up?',
          answer:
            'You level up after accumulating a certain number of points. Each level requires more points than the previous one. Higher levels introduce new colors to the game, increasing the visual complexity and challenge.',
        },
        {
          question: 'How many colors can appear?',
          answer:
            'The game starts with basic colors (red, blue, green, yellow) and progressively adds more colors like purple, orange, and pink as you level up. Advanced levels can have 7 or more distinct colors.',
        },
        {
          question: 'Does tapping faster give more points?',
          answer:
            'There is a small speed bonus for rapid consecutive taps, but accuracy is more important. A broken chain due to rushing will cost you more points than you would gain from speed bonuses.',
        },
      ],
      funFacts: [
        'The human eye can distinguish approximately 10 million different colors',
        'Color recognition is one of the fastest visual processes in the brain, taking only 50-100 milliseconds',
        'Studies show that regular color matching games can improve visual attention and cognitive flexibility',
        'Professional gamers who play color-based games show enhanced activity in their visual cortex',
      ],
    },
  },
  {
    id: 'tariff-dodge',
    name: 'Tariff Dodge',
    description: 'Dodge the tariffs',
    icon: '📦',
    path: '/games/tariff-dodge',
    color: '#DC2626',
    estimatedTime: '30s',
    seo: {
      title: 'Tariff Dodge | ddangit',
      description: 'Dodge falling tariffs! How long can you survive?',
    },
    guide: {
      introduction:
        'Tariff Dodge is an endless survival game where you control a character dodging falling obstacles. Inspired by current events and the challenges of international trade, your goal is to navigate through an increasingly difficult storm of falling tariff boxes. How long can you survive?',
      howToPlay: [
        'Your character appears at the bottom of the screen',
        'Move left and right by dragging your mouse or finger on mobile devices',
        'Tariff boxes fall from the top of the screen at random positions',
        'Avoid collision with any falling tariff - one hit ends the game',
        'The tariffs gradually fall faster as time progresses',
        'Your survival time is tracked in seconds and becomes your final score',
        'There is no way to win - the goal is simply to survive as long as possible',
      ],
      scoring: [
        'Your score is purely based on survival time in seconds',
        'Each second you survive adds 1 point to your score',
        'There are no bonuses for near-misses or special maneuvers',
        'High scores are saved locally so you can track your personal best',
        'The global leaderboard lets you compare your survival skills with other players',
        'Reaching 30+ seconds puts you in the top tier of players',
      ],
      tips: [
        'Stay near the center of the screen - this gives you maximum escape options in either direction',
        'Make small, precise movements rather than large sweeping ones',
        'Watch the spawn points at the top of the screen to anticipate incoming tariffs',
        'Keep your eyes constantly moving to track multiple obstacles simultaneously',
        'Do not panic when the game speeds up - controlled movements are key to survival',
        'Learn to use peripheral vision to detect incoming threats from the sides',
        'Develop a sense of rhythm - tariffs often fall in patterns',
        'If you find yourself cornered, commit fully to one escape direction',
      ],
      history:
        'Dodge games are one of the oldest genres in video gaming, dating back to arcade classics like Frogger (1981) and later mobile hits like various dodge-the-obstacles games. The genre tests pure reflexes and spatial awareness without complex mechanics. Tariff Dodge adds a timely twist by theming the obstacles around international trade tensions. The game serves as both entertainment and a playful commentary on the unpredictable nature of trade policies.',
      strategies: [
        'The Center Anchor: Position yourself in the middle third of the screen. This minimizes the maximum distance you ever need to travel to reach safety.',
        'The Wave Prediction: Instead of reacting to individual tariffs, try to see patterns in how they fall. Often there are natural "waves" with gaps between them.',
        'The Edge Escape: When the center becomes too crowded, hugging the edges can work - but only briefly. Return to center as soon as possible.',
        'The Micro-Movement Method: Instead of stopping between dodges, keep moving slightly. Continuous small adjustments are faster than starting from a full stop.',
        'The Peripheral Scan: Train yourself to look at the upper-middle of the screen while using peripheral vision to track your character. This gives you more warning time.',
        'The Calm Zone: The bottom third of the screen is your safe planning zone. By the time tariffs reach there, you should already be moving.',
      ],
      faq: [
        {
          question: 'Why does the game feel harder over time?',
          answer:
            'The falling speed of tariffs increases gradually as you survive longer. This ensures that every game eventually ends and creates escalating tension. The difficulty curve is exponential, meaning the game becomes dramatically harder after about 20 seconds.',
        },
        {
          question: 'Is there a maximum difficulty level?',
          answer:
            'Yes, the falling speed caps at a certain point to remain playable. However, even at maximum speed, surviving requires exceptional reflexes and anticipation. Very few players can survive beyond 60 seconds.',
        },
        {
          question: 'Can I collect power-ups or special abilities?',
          answer:
            'No, Tariff Dodge is intentionally minimalist. There are no power-ups, shields, or special abilities. This purity of gameplay means your score is purely a measure of your reflexes and strategy.',
        },
        {
          question: 'Why tariffs specifically?',
          answer:
            'The theme is a playful nod to international trade news. The falling boxes represent the unpredictable nature of trade policies that businesses must navigate. It is both entertaining and gently educational.',
        },
      ],
      funFacts: [
        'The average human reaction time to a visual stimulus is about 250 milliseconds',
        'Dodge games are used by some esports teams as warmup exercises for improving reflexes',
        'The concept of "flow state" - being fully absorbed in an activity - is common in survival games like this',
        'Studies show that action games can improve attention and spatial cognition',
      ],
    },
  },
  {
    id: 'color-match',
    name: 'Color Match',
    description: 'Stroop test challenge',
    icon: '🎨',
    path: '/games/color-match',
    color: '#EC4899',
    estimatedTime: '30s',
    seo: {
      title: 'Color Match | ddangit',
      description: 'Stroop test! Match the color of the text, not the word!',
    },
    guide: {
      introduction:
        'Color Match is based on the famous Stroop Effect, a psychological phenomenon discovered in 1935. Your brain automatically reads words faster than it processes colors, creating a fascinating conflict when a color word is written in a different ink color. Can you override your instincts and match the ink color instead of reading the word?',
      howToPlay: [
        'A color word appears in the center of the screen (like "RED", "BLUE", or "GREEN")',
        'The word is deliberately displayed in a DIFFERENT ink color than what it spells',
        'Your task is to tap the button matching the INK COLOR, NOT the word itself',
        'For example: If the word "RED" appears in blue ink, you must tap the BLUE button',
        'You start with 30 seconds on the clock',
        'Correct answers add points and keep the timer steady',
        'Wrong answers deduct points AND subtract time from your clock',
        'The game ends when the timer reaches zero',
      ],
      scoring: [
        '+10 points for each correct answer',
        '-5 points for each wrong answer (plus a 2-second time penalty)',
        'Every 5 correct answers in a row grants a +1 second time bonus',
        'Building longer streaks is the key to extending your game and maximizing score',
        'Your accuracy percentage is tracked and displayed at the end',
        'High scores require both speed AND accuracy - rushing leads to penalties',
      ],
      tips: [
        'Train yourself to ignore the word completely - focus ONLY on the color you see',
        'If you find yourself reading the word, try squinting slightly to blur the letters',
        'The Stroop Effect is stronger for some colors than others - learn which ones trip you up',
        'Practice makes perfect - your brain can learn to suppress automatic reading',
        'After a mistake, take a brief mental pause before continuing',
        'Speed will come naturally once accuracy becomes automatic',
        'Try saying the color out loud in your head instead of reading the word',
        'Keep your fingers hovering over the buttons to minimize response time',
      ],
      history:
        'The Stroop Effect was first published by John Ridley Stroop in 1935 in his doctoral dissertation. He discovered that people take significantly longer to name the ink color of a word when the word itself spells a different color. This happens because reading is so automatic for literate adults that it interferes with color naming. The Stroop Test has become one of the most famous experiments in psychology and is still used today to study attention, cognitive flexibility, and executive function. It is also used clinically to detect cognitive decline and brain injuries.',
      strategies: [
        'The Blur Technique: Slightly unfocus your eyes so the letters become less distinct. This reduces the automatic reading response and helps you perceive just the color.',
        'The Color Association Method: Build strong mental associations with each button position. Eventually, you will tap reflexively without conscious processing.',
        'The Verbal Suppression Strategy: Mentally hum or count while playing. This occupies the language centers of your brain, reducing automatic word reading.',
        'The Peripheral Focus: Look slightly above or below the word. Peripheral vision is better at perceiving color than reading text.',
        'The Streak Management: Prioritize maintaining accuracy over speed. The time bonuses from streaks are more valuable than slightly faster individual responses.',
        'The Reset Breath: After any mistake, take one deliberate breath. This prevents the frustration cascade that often leads to multiple consecutive errors.',
      ],
      faq: [
        {
          question: 'Why is this so hard even though it seems simple?',
          answer:
            'Reading is an automatic process for literate adults - your brain reads words without conscious effort. The Stroop Effect demonstrates how this automatic processing can interfere with other tasks. With practice, you can train yourself to suppress this interference.',
        },
        {
          question: 'Does getting better at this game mean my brain is improving?',
          answer:
            'Yes! The Stroop Test measures cognitive flexibility and executive function. Improving at this game indicates better ability to suppress automatic responses and focus attention - skills that transfer to many real-life situations.',
        },
        {
          question: 'Why do some color combinations feel harder than others?',
          answer:
            'Research shows the Stroop Effect is stronger for certain combinations. For example, seeing "RED" in green ink is particularly challenging because red and green are complementary colors with high contrast. Blue-yellow combinations also show strong interference.',
        },
        {
          question: 'Is there an age where this gets harder or easier?',
          answer:
            'Children who are learning to read experience less Stroop interference because reading is not yet automatic. The effect is strongest in skilled adult readers. Older adults may experience slightly more interference but can improve with practice.',
        },
      ],
      funFacts: [
        'The Stroop Effect is used in clinical settings to detect conditions like ADHD, depression, and early dementia',
        'Bilingual people can experience the Stroop Effect across languages - seeing "AZUL" (Spanish for blue) in red ink still causes interference',
        'The average Stroop interference adds about 100-200 milliseconds to response time',
        'Brain imaging shows the Stroop task activates the anterior cingulate cortex, which handles conflict resolution',
        'The original 1935 Stroop paper has been cited over 20,000 times, making it one of the most influential psychology studies ever',
      ],
    },
  },
  {
    id: 'infinite-stairs',
    name: 'Infinite Stairs',
    description: 'Climb as high as you can',
    icon: '🪜',
    path: '/games/infinite-stairs',
    color: '#6366F1',
    estimatedTime: '30s',
    seo: {
      title: 'Infinite Stairs | ddangit',
      description: 'Climb infinite stairs! Left or right, how high can you go?',
    },
    guide: {
      introduction:
        'Infinite Stairs is a rhythm-based climbing game that tests your reflexes and pattern recognition. Tap left or right to climb an endless staircase, building speed and combos as you ascend. With its simple two-button gameplay and addictive progression system, every climb becomes a race against time and your own high score.',
      howToPlay: [
        'Your character stands at the bottom of an endless staircase',
        'Each stair goes either left or right - you can see the next few stairs ahead',
        'Tap the LEFT side of the screen to climb a left-facing stair',
        'Tap the RIGHT side of the screen to climb a right-facing stair',
        'Tapping the wrong direction immediately ends the game',
        'A timer bar depletes constantly - you must keep climbing to refill it',
        'Fast consecutive correct taps build your combo meter',
        'When the combo meter fills, you enter Fever Mode for bonus points',
        'Special golden stairs occasionally appear for extra points',
      ],
      scoring: [
        'Each floor climbed awards 1 base point',
        'Fast inputs (under 300ms between taps) award speed bonus points',
        'Golden stairs are worth 5 points instead of 1',
        'During Fever Mode, all points are multiplied by 2x',
        'Maintaining long combos without mistakes increases your multiplier potential',
        'Your final score combines floors climbed, speed bonuses, and Fever Mode multipliers',
        'High scores are saved to the global leaderboard',
      ],
      tips: [
        'Find a consistent rhythm rather than just reacting to each stair - anticipate the pattern',
        'Keep both thumbs hovering over the screen, ready to tap either side instantly',
        'Focus your eyes on the next 2-3 stairs ahead, not just the immediate next one',
        'Start at a comfortable pace and gradually speed up as you build confidence',
        'Fever Mode is the key to high scores - prioritize building and maintaining combos',
        'Golden stairs appear randomly - do not break your rhythm trying to find them',
        'If you feel yourself losing focus, take a tiny mental breath without stopping',
        'Practice until the left-right mapping becomes completely automatic',
      ],
      history:
        'Infinite Stairs belongs to the genre of endless runner games that became hugely popular with mobile gaming. The simple left-right mechanic was popularized by games like "Infinite Stairs" in the mid-2010s, which achieved millions of downloads. The genre appeals to our psychological desire for "just one more try" and the satisfaction of beating personal records. The stair-climbing theme adds a natural sense of progression - you are literally climbing higher with each correct input.',
      strategies: [
        'The Rhythm Method: Instead of reacting to each stair individually, establish a steady tapping rhythm. Your brain can anticipate patterns faster than it can react to individual stimuli.',
        'The Two-Thumb Stance: Position your thumbs symmetrically on either side of the screen. This minimizes the physical distance needed to tap and creates consistent response times.',
        'The Look-Ahead Focus: Train yourself to always look 2-3 stairs ahead of your current position. This gives your brain processing time and prevents surprises.',
        'The Fever Priority: Treat Fever Mode as your primary goal. Accept slightly slower climbs if it means maintaining the combo that triggers Fever.',
        'The Golden Stair Awareness: While not worth breaking rhythm for, staying alert for golden stairs adds significant points. Peripheral vision helps here.',
        'The Recovery Pause: After a mistake ends your run, wait a moment before restarting. Frustration leads to more mistakes.',
      ],
      faq: [
        {
          question: 'How do I enter Fever Mode?',
          answer:
            'Fever Mode activates when you fill the combo meter by tapping quickly and accurately for a sustained period. The meter is visible on screen - keep building it without making mistakes to trigger Fever.',
        },
        {
          question: 'Why does the game end even when I tap correctly?',
          answer:
            'The timer bar depletes constantly. If you tap too slowly, even with correct directions, the timer will empty and end your game. You need to maintain a minimum speed to keep the timer refilled.',
        },
        {
          question: 'What triggers golden stairs to appear?',
          answer:
            'Golden stairs appear randomly at approximately 1 in 10 frequency. There is no way to predict or influence when they appear - just stay alert and grab them when they come.',
        },
        {
          question: 'Is there a maximum score or ending?',
          answer:
            'No, the stairs continue infinitely. The game only ends when you make a mistake or the timer runs out. Top players have climbed thousands of stairs in a single run.',
        },
        {
          question: 'Does the game get harder as I climb higher?',
          answer:
            'The stair pattern remains random, but the timer depletes faster at higher floors, requiring quicker tapping to survive. This creates a natural difficulty curve.',
        },
      ],
      funFacts: [
        'The world record for stair climbing (real stairs) is over 15,000 steps in one hour',
        'Rhythm games like this train the motor cortex and improve hand-eye coordination',
        'The "one more try" feeling is related to dopamine release patterns in the brain',
        'Simple two-choice games are used in psychology to study decision-making speed',
        'Average human choice reaction time (picking left or right) is about 350 milliseconds',
      ],
    },
  },
];

// O(1) 조회를 위한 Map
const GAMES_MAP = new Map<string, GameMeta>(GAMES.map((g) => [g.id, g]));

// 유틸리티 함수
export const getGameById = (id: string): GameMeta | undefined =>
  GAMES_MAP.get(id);

export const getGameIds = (): string[] => GAMES.map((game) => game.id);
