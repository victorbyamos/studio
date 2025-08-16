import { config } from 'dotenv';
config();

import '@/ai/flows/enhance-profile.ts';
import '@/ai/flows/parse-resume.ts';
import '@/ai/flows/suggest-skills.ts';
import '@/ai/flows/regenerate-profile.ts';
