export interface PresetBlock {
  startTimeHhmm: string;
  endTimeHhmm: string;
  type: 'study' | 'work' | 'focus' | 'break' | 'personal';
}

export interface PresetTemplate {
  name: string;
  description: string;
  blocks: PresetBlock[];
}

export interface PersonaTemplates {
  id: string;
  title: string;
  icon: string; // Emoji representing the persona
  options: PresetTemplate[];
}

export const personasData: PersonaTemplates[] = [
  {
    id: 'university',
    title: 'University Student',
    icon: '🎓',
    options: [
      {
        name: 'Exam Cram Session',
        description: 'Focus-heavy study schedule designed to maximize absorption and revision before midterms.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // wake up & breakfast
          { startTimeHhmm: '09:00', endTimeHhmm: '11:30', type: 'focus' },    // heavy active recall focus
          { startTimeHhmm: '11:30', endTimeHhmm: '12:00', type: 'break' },    // stretch & water
          { startTimeHhmm: '12:00', endTimeHhmm: '14:00', type: 'study' },    // mock exam practice
          { startTimeHhmm: '14:00', endTimeHhmm: '15:00', type: 'break' },    // lunch break
          { startTimeHhmm: '15:00', endTimeHhmm: '17:30', type: 'focus' },    // group study & review
          { startTimeHhmm: '17:30', endTimeHhmm: '19:00', type: 'personal' }, // gym / walk
          { startTimeHhmm: '19:00', endTimeHhmm: '20:00', type: 'break' },    // dinner
          { startTimeHhmm: '20:00', endTimeHhmm: '22:00', type: 'study' },    // evening light review
          { startTimeHhmm: '22:00', endTimeHhmm: '23:00', type: 'personal' }  // wind down
        ]
      },
      {
        name: 'Lecture-Packed Day',
        description: 'Structured to balance back-to-back lectures with post-class review sessions.',
        blocks: [
          { startTimeHhmm: '07:30', endTimeHhmm: '08:30', type: 'personal' }, // morning routine
          { startTimeHhmm: '08:30', endTimeHhmm: '12:00', type: 'work' },     // morning lectures
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch break
          { startTimeHhmm: '13:00', endTimeHhmm: '16:00', type: 'work' },     // afternoon labs/lectures
          { startTimeHhmm: '16:00', endTimeHhmm: '17:00', type: 'personal' }, // sports / social
          { startTimeHhmm: '17:00', endTimeHhmm: '19:00', type: 'study' },    // review lecture notes
          { startTimeHhmm: '19:00', endTimeHhmm: '20:00', type: 'break' },    // dinner
          { startTimeHhmm: '20:00', endTimeHhmm: '22:00', type: 'focus' },    // assignment prep focus
          { startTimeHhmm: '22:00', endTimeHhmm: '23:00', type: 'personal' }  // sleep preparation
        ]
      },
      {
        name: 'Balanced Flow (Study & Health)',
        description: 'A moderate schedule keeping body and mind equally active throughout the day.',
        blocks: [
          { startTimeHhmm: '07:00', endTimeHhmm: '08:30', type: 'personal' }, // cardio/workout & breakfast
          { startTimeHhmm: '09:00', endTimeHhmm: '12:00', type: 'study' },    // study slot
          { startTimeHhmm: '12:00', endTimeHhmm: '13:30', type: 'break' },    // lunch & rest
          { startTimeHhmm: '13:30', endTimeHhmm: '16:30', type: 'work' },     // class/research
          { startTimeHhmm: '16:30', endTimeHhmm: '18:30', type: 'personal' }, // hobbies / social
          { startTimeHhmm: '18:30', endTimeHhmm: '19:30', type: 'break' },    // dinner
          { startTimeHhmm: '19:30', endTimeHhmm: '21:30', type: 'focus' },    // reading / coding focus
          { startTimeHhmm: '21:30', endTimeHhmm: '23:00', type: 'personal' }  // relaxation
        ]
      },
      {
        name: 'Weekend Hackathon / Sprint',
        description: 'Immersive coding or creative blocks with scheduled screen breaks to prevent burnout.',
        blocks: [
          { startTimeHhmm: '09:00', endTimeHhmm: '10:00', type: 'personal' }, // lazy morning prep
          { startTimeHhmm: '10:00', endTimeHhmm: '13:00', type: 'focus' },    // coding focus block 1
          { startTimeHhmm: '13:00', endTimeHhmm: '14:00', type: 'break' },    // lunch break
          { startTimeHhmm: '14:00', endTimeHhmm: '17:00', type: 'focus' },    // coding focus block 2
          { startTimeHhmm: '17:00', endTimeHhmm: '18:00', type: 'personal' }, // neighborhood walk
          { startTimeHhmm: '18:00', endTimeHhmm: '20:00', type: 'work' },     // debugging / deck design
          { startTimeHhmm: '20:00', endTimeHhmm: '21:00', type: 'break' },    // dinner
          { startTimeHhmm: '21:00', endTimeHhmm: '23:00', type: 'personal' }  // gaming / relaxation
        ]
      }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate Job Pro',
    icon: '💼',
    options: [
      {
        name: 'Maker\'s Deep Work Day',
        description: 'Maximized focus periods for engineers, writers, and designers. Keeps distraction low.',
        blocks: [
          { startTimeHhmm: '07:30', endTimeHhmm: '08:30', type: 'personal' }, // morning routine & commute
          { startTimeHhmm: '09:00', endTimeHhmm: '12:00', type: 'focus' },    // maker deep work
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // quiet lunch
          { startTimeHhmm: '13:00', endTimeHhmm: '14:00', type: 'work' },     // emails / slack / syncs
          { startTimeHhmm: '14:00', endTimeHhmm: '16:30', type: 'focus' },    // afternoon focus block
          { startTimeHhmm: '16:30', endTimeHhmm: '17:30', type: 'work' },     // documentation / reviews
          { startTimeHhmm: '17:30', endTimeHhmm: '19:30', type: 'personal' }, // gym & commute home
          { startTimeHhmm: '19:30', endTimeHhmm: '20:30', type: 'break' },    // dinner
          { startTimeHhmm: '20:30', endTimeHhmm: '22:30', type: 'personal' }  // family / hobby time
        ]
      },
      {
        name: 'Meetings & Syncs Heavy',
        description: 'Optimized to tackle syncs and align departments while retaining brief breaks.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // commute / coffee
          { startTimeHhmm: '09:00', endTimeHhmm: '10:30', type: 'work' },     // morning standups & reviews
          { startTimeHhmm: '10:30', endTimeHhmm: '12:00', type: 'focus' },    // urgent action items
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch sync / rest
          { startTimeHhmm: '13:00', endTimeHhmm: '15:30', type: 'work' },     // client calls & design sessions
          { startTimeHhmm: '15:30', endTimeHhmm: '16:00', type: 'break' },    // coffee reset
          { startTimeHhmm: '16:00', endTimeHhmm: '17:30', type: 'work' },     // feedback reviews & team sync
          { startTimeHhmm: '17:30', endTimeHhmm: '22:30', type: 'personal' }  // full evening offload
        ]
      },
      {
        name: 'Remote Work Flexible',
        description: 'Emphasizes physical movement, flexible hours, and split focus sessions at home.',
        blocks: [
          { startTimeHhmm: '07:00', endTimeHhmm: '08:30', type: 'personal' }, // walk outside & coffee
          { startTimeHhmm: '09:00', endTimeHhmm: '11:30', type: 'focus' },    // coding/design deep sprint
          { startTimeHhmm: '11:30', endTimeHhmm: '12:30', type: 'personal' }, // home chore reset
          { startTimeHhmm: '12:30', endTimeHhmm: '13:30', type: 'break' },    // lunch
          { startTimeHhmm: '13:30', endTimeHhmm: '16:00', type: 'work' },     // collaboration & calls
          { startTimeHhmm: '16:00', endTimeHhmm: '17:30', type: 'focus' },    // task completion sprint
          { startTimeHhmm: '17:30', endTimeHhmm: '19:30', type: 'personal' }, // gym / cooking dinner
          { startTimeHhmm: '19:30', endTimeHhmm: '20:30', type: 'break' },    // dinner
          { startTimeHhmm: '20:30', endTimeHhmm: '22:30', type: 'study' }     // course / tech reading
        ]
      },
      {
        name: 'Friday Wind Down',
        description: 'Tackling review chores, retrospectives, and prep for the coming week before logoff.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // morning routine
          { startTimeHhmm: '09:00', endTimeHhmm: '11:00', type: 'work' },     // inbox cleanup & ticket reviews
          { startTimeHhmm: '11:00', endTimeHhmm: '12:30', type: 'focus' },    // week wrap-up sprint
          { startTimeHhmm: '12:30', endTimeHhmm: '13:30', type: 'break' },    // lunch break
          { startTimeHhmm: '13:30', endTimeHhmm: '15:00', type: 'work' },     // team retrospective
          { startTimeHhmm: '15:00', endTimeHhmm: '16:30', type: 'study' },    // planning next week
          { startTimeHhmm: '16:30', endTimeHhmm: '23:00', type: 'personal' }  // weekend starts
        ]
      }
    ]
  },
  {
    id: 'teacher',
    title: 'Professor / Teacher',
    icon: '👩‍🏫',
    options: [
      {
        name: 'Teaching & Classroom Day',
        description: 'Prioritizes lecture delivery, student office hours, and homework grading.',
        blocks: [
          { startTimeHhmm: '07:00', endTimeHhmm: '08:00', type: 'personal' }, // morning prep
          { startTimeHhmm: '08:00', endTimeHhmm: '09:30', type: 'focus' },    // lecture slides final prep
          { startTimeHhmm: '09:30', endTimeHhmm: '12:00', type: 'work' },     // classroom teaching
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch break
          { startTimeHhmm: '13:00', endTimeHhmm: '15:00', type: 'work' },     // laboratory teaching / office hours
          { startTimeHhmm: '15:00', endTimeHhmm: '17:00', type: 'study' },    // exam grading & feedback
          { startTimeHhmm: '17:00', endTimeHhmm: '19:00', type: 'personal' }, // relaxation / commute
          { startTimeHhmm: '19:00', endTimeHhmm: '20:00', type: 'break' },    // dinner
          { startTimeHhmm: '20:00', endTimeHhmm: '22:00', type: 'study' }     // academic paper reading
        ]
      },
      {
        name: 'Research & Manuscript Writing',
        description: 'Protected blocks for academic research, drafting grant proposals, and writing papers.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // breakfast
          { startTimeHhmm: '09:00', endTimeHhmm: '12:00', type: 'focus' },    // research writing (deep focus)
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch break
          { startTimeHhmm: '13:00', endTimeHhmm: '15:30', type: 'focus' },    // data analysis & scripting
          { startTimeHhmm: '15:30', endTimeHhmm: '17:00', type: 'work' },     // student thesis review
          { startTimeHhmm: '17:00', endTimeHhmm: '19:00', type: 'personal' }, // physical reset (run/gym)
          { startTimeHhmm: '19:00', endTimeHhmm: '20:00', type: 'break' },    // dinner
          { startTimeHhmm: '20:00', endTimeHhmm: '22:00', type: 'study' }     // peer reviews & review journal
        ]
      },
      {
        name: 'Student Advisory & Meetings',
        description: 'Dedicated to student consultation, research group syncs, and administrative work.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // morning prep
          { startTimeHhmm: '09:00', endTimeHhmm: '11:00', type: 'work' },     // department committee meeting
          { startTimeHhmm: '11:00', endTimeHhmm: '12:30', type: 'work' },     // student advisory meetings
          { startTimeHhmm: '12:30', endTimeHhmm: '13:30', type: 'break' },    // lunch
          { startTimeHhmm: '13:30', endTimeHhmm: '15:30', type: 'work' },     // research group checkins
          { startTimeHhmm: '15:30', endTimeHhmm: '17:30', type: 'study' },    // recommendations letters drafting
          { startTimeHhmm: '17:30', endTimeHhmm: '23:00', type: 'personal' }  // evening reset
        ]
      },
      {
        name: 'Syllabus & Course Prep',
        description: 'Setting up syllabus material, lectures templates, and uploading digital coursework.',
        blocks: [
          { startTimeHhmm: '08:30', endTimeHhmm: '09:30', type: 'personal' }, // breakfast
          { startTimeHhmm: '09:30', endTimeHhmm: '12:00', type: 'focus' },    // curriculum layout planning
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch
          { startTimeHhmm: '13:00', endTimeHhmm: '15:30', type: 'work' },     // quiz/assignment formulation
          { startTimeHhmm: '15:30', endTimeHhmm: '17:00', type: 'study' },    // setup LMS canvas pages
          { startTimeHhmm: '17:00', endTimeHhmm: '22:30', type: 'personal' }  // leisure night
        ]
      }
    ]
  },
  {
    id: 'school',
    title: 'High School Student',
    icon: '🎒',
    options: [
      {
        name: 'Weekday High School Day',
        description: 'Morning classroom hours, after-school athletics, and scheduled evening homework.',
        blocks: [
          { startTimeHhmm: '06:30', endTimeHhmm: '07:30', type: 'personal' }, // morning routine & school bus
          { startTimeHhmm: '08:00', endTimeHhmm: '12:00', type: 'work' },     // school classes
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch at school
          { startTimeHhmm: '13:00', endTimeHhmm: '15:00', type: 'work' },     // school classes
          { startTimeHhmm: '15:00', endTimeHhmm: '17:00', type: 'personal' }, // school athletics / extracurriculars
          { startTimeHhmm: '17:00', endTimeHhmm: '18:30', type: 'break' },    // return home & relax
          { startTimeHhmm: '18:30', endTimeHhmm: '20:30', type: 'study' },    // homework & studies
          { startTimeHhmm: '20:30', endTimeHhmm: '21:30', type: 'break' },    // dinner & chat
          { startTimeHhmm: '21:30', endTimeHhmm: '22:30', type: 'personal' }  // read book & early sleep
        ]
      },
      {
        name: 'SAT / Board Test Study Weekend',
        description: 'Simulated practice tests, focused review of error logs, and evening reset.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // healthy breakfast
          { startTimeHhmm: '09:00', endTimeHhmm: '12:00', type: 'focus' },    // SAT Practice Section (Math)
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch
          { startTimeHhmm: '13:00', endTimeHhmm: '15:30', type: 'focus' },    // SAT Practice Section (Verbal)
          { startTimeHhmm: '15:30', endTimeHhmm: '16:30', type: 'break' },    // walk/rest
          { startTimeHhmm: '16:30', endTimeHhmm: '18:30', type: 'study' },    // error review & review concepts
          { startTimeHhmm: '18:30', endTimeHhmm: '21:30', type: 'personal' }, // hangout / console gaming
          { startTimeHhmm: '21:30', endTimeHhmm: '22:30', type: 'personal' }  // sleep preparation
        ]
      },
      {
        name: 'Sports & Hobbies Day',
        description: 'Balances intensive physical training, hobby building, and routine homework reviews.',
        blocks: [
          { startTimeHhmm: '07:00', endTimeHhmm: '08:00', type: 'personal' }, // morning jog
          { startTimeHhmm: '08:30', endTimeHhmm: '12:30', type: 'work' },     // club classes / weekend school
          { startTimeHhmm: '12:30', endTimeHhmm: '13:30', type: 'break' },    // lunch
          { startTimeHhmm: '13:30', endTimeHhmm: '16:30', type: 'personal' }, // intensive hobby practice (music/sport)
          { startTimeHhmm: '16:30', endTimeHhmm: '18:30', type: 'study' },    // review science/math homework
          { startTimeHhmm: '18:30', endTimeHhmm: '20:30', type: 'break' },    // dinner & screen time
          { startTimeHhmm: '20:30', endTimeHhmm: '22:00', type: 'personal' }  // wind down
        ]
      },
      {
        name: 'Sunday Routine Reset',
        description: 'Focuses on packing bags, formatting templates, planning tasks, and family time.',
        blocks: [
          { startTimeHhmm: '08:30', endTimeHhmm: '09:30', type: 'personal' }, // breakfast
          { startTimeHhmm: '09:30', endTimeHhmm: '11:30', type: 'personal' }, // bedroom cleaning & laundry
          { startTimeHhmm: '11:30', endTimeHhmm: '13:00', type: 'study' },    // layout homework prep
          { startTimeHhmm: '13:00', endTimeHhmm: '14:00', type: 'break' },    // lunch
          { startTimeHhmm: '14:00', endTimeHhmm: '17:00', type: 'personal' }, // outdoor family trip
          { startTimeHhmm: '17:00', endTimeHhmm: '18:30', type: 'study' },    // prepare backpack & planner review
          { startTimeHhmm: '18:30', endTimeHhmm: '20:00', type: 'break' },    // dinner
          { startTimeHhmm: '20:00', endTimeHhmm: '22:00', type: 'personal' }  // movie night
        ]
      }
    ]
  },
  {
    id: 'freelancer',
    title: 'Freelancer / Creator',
    icon: '🎨',
    options: [
      {
        name: 'Content Production Day',
        description: 'Immersive creative segments focusing on scripting, recording, and post-editing.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // morning tea
          { startTimeHhmm: '09:00', endTimeHhmm: '11:30', type: 'focus' },    // scriptwriting & planning
          { startTimeHhmm: '11:30', endTimeHhmm: '12:00', type: 'break' },    // coffee break
          { startTimeHhmm: '12:00', endTimeHhmm: '14:30', type: 'focus' },    // filming/recording video footage
          { startTimeHhmm: '14:30', endTimeHhmm: '15:30', type: 'break' },    // late lunch
          { startTimeHhmm: '15:30', endTimeHhmm: '18:00', type: 'study' },    // video editing & thumbnail draft
          { startTimeHhmm: '18:00', endTimeHhmm: '19:30', type: 'personal' }, // outdoor exercise
          { startTimeHhmm: '19:30', endTimeHhmm: '20:30', type: 'break' },    // dinner
          { startTimeHhmm: '20:30', endTimeHhmm: '22:30', type: 'personal' }  // community chat & review comments
        ]
      },
      {
        name: 'Client Sprint & Admin',
        description: 'Focuses on client check-ins, proposal drafting, writing emails, and invoicing.',
        blocks: [
          { startTimeHhmm: '08:30', endTimeHhmm: '09:30', type: 'personal' }, // breakfast
          { startTimeHhmm: '09:30', endTimeHhmm: '11:00', type: 'work' },     // client sync calls
          { startTimeHhmm: '11:00', endTimeHhmm: '13:00', type: 'focus' },    // high-priority client deliverables
          { startTimeHhmm: '13:00', endTimeHhmm: '14:00', type: 'break' },    // lunch
          { startTimeHhmm: '14:00', endTimeHhmm: '16:00', type: 'work' },     // invoice compilation & writing proposals
          { startTimeHhmm: '16:00', endTimeHhmm: '18:00', type: 'study' },    // inbox cleanup & lead follow-up
          { startTimeHhmm: '18:00', endTimeHhmm: '22:30', type: 'personal' }  // dinner & full evening off
        ]
      },
      {
        name: 'Skill Upgrading & Portfolio',
        description: 'Invest in learning new tools, attending bootcamps, and upgrading your portfolio site.',
        blocks: [
          { startTimeHhmm: '08:00', endTimeHhmm: '09:00', type: 'personal' }, // morning routine
          { startTimeHhmm: '09:00', endTimeHhmm: '12:00', type: 'study' },    // UI/UX course study
          { startTimeHhmm: '12:00', endTimeHhmm: '13:00', type: 'break' },    // lunch
          { startTimeHhmm: '13:00', endTimeHhmm: '16:00', type: 'focus' },    // redesigning portfolio homepage
          { startTimeHhmm: '16:00', endTimeHhmm: '17:30', type: 'personal' }, // afternoon park walk
          { startTimeHhmm: '17:30', endTimeHhmm: '19:30', type: 'focus' },    // coding case study
          { startTimeHhmm: '19:30', endTimeHhmm: '20:30', type: 'break' },    // dinner
          { startTimeHhmm: '20:30', endTimeHhmm: '22:30', type: 'personal' }  // design community networking
        ]
      },
      {
        name: 'Creative Flex Day',
        description: 'Open-ended day focusing on brainstorming, reading, and sketching mockups.',
        blocks: [
          { startTimeHhmm: '09:00', endTimeHhmm: '10:00', type: 'personal' }, // tea & routine
          { startTimeHhmm: '10:00', endTimeHhmm: '12:30', type: 'personal' }, // reading creative design books
          { startTimeHhmm: '12:30', endTimeHhmm: '13:30', type: 'break' },    // lunch
          { startTimeHhmm: '13:30', endTimeHhmm: '16:30', type: 'focus' },    // moodboarding & iPad sketching
          { startTimeHhmm: '16:30', endTimeHhmm: '18:30', type: 'personal' }, // photography walk
          { startTimeHhmm: '18:30', endTimeHhmm: '23:00', type: 'personal' }  // relaxation
        ]
      }
    ]
  },
  {
    id: 'custom',
    title: 'Custom Slate',
    icon: '✍️',
    options: [
      {
        name: 'Full Day Blank Slate',
        description: 'Generates consecutive 2-hour slots spanning 7:00 AM to 11:00 PM. Perfect for designing your timeline from scratch.',
        blocks: [
          { startTimeHhmm: '07:00', endTimeHhmm: '09:00', type: 'personal' },
          { startTimeHhmm: '09:00', endTimeHhmm: '11:00', type: 'work' },
          { startTimeHhmm: '11:00', endTimeHhmm: '13:00', type: 'work' },
          { startTimeHhmm: '13:00', endTimeHhmm: '14:00', type: 'break' }, // lunch
          { startTimeHhmm: '14:00', endTimeHhmm: '16:00', type: 'work' },
          { startTimeHhmm: '16:00', endTimeHhmm: '18:00', type: 'personal' },
          { startTimeHhmm: '18:00', endTimeHhmm: '19:00', type: 'break' }, // dinner
          { startTimeHhmm: '19:00', endTimeHhmm: '21:00', type: 'focus' },
          { startTimeHhmm: '21:00', endTimeHhmm: '23:00', type: 'personal' }
        ]
      }
    ]
  }
];
