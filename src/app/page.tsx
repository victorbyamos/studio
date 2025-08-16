'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProfileForm } from '@/components/profile-form';
import { ProfilePreview } from '@/components/profile-preview';
import type { Profile } from '@/lib/types';
import { regenerateProfile } from '@/ai/flows/regenerate-profile';
import { useToast } from '@/hooks/use-toast';

const initialProfile: Profile = {
  name: 'Jane Doe',
  headline: 'Aspiring Full Stack Developer | React, Node.js, TypeScript',
  contactDetails: 'jane.doe@email.com | (555) 123-4567 | linkedin.com/in/janedoe',
  summary:
    'Innovative and detail-oriented Full Stack Developer with a passion for creating dynamic and user-friendly web applications. Proficient in front-end and back-end technologies, with a strong foundation in JavaScript, React, and Node.js. Eager to contribute to a challenging and growth-oriented team.',
  workExperience: `Software Engineer Intern | Tech Solutions Inc. | Jun 2023 - Aug 2023
- Developed and maintained features for a large-scale web application using React and TypeScript.
- Collaborated with senior developers to design and implement RESTful APIs with Node.js and Express.
- Wrote unit and integration tests to ensure code quality and reliability.`,
  education: `B.S. in Computer Science | University of Technology | 2020 - 2024
- GPA: 3.8/4.0
- Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems.`,
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'Docker'],
  industry: 'Information Technology and Services',
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleRegenerateProfile = async () => {
    setIsRegenerating(true);
    try {
      const result = await regenerateProfile(profile);
      setProfile(prev => ({
        ...prev,
        headline: result.headline,
        summary: result.summary,
        workExperience: result.enhancedWorkExperience,
      }));
      toast({
        title: 'Profile Regenerated!',
        description: 'Your headline, summary, and work experience have been updated.',
      });
    } catch (error) {
      console.error('Error regenerating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Regeneration Error',
        description: 'Could not regenerate the profile. Please try again.',
      });
    } finally {
      setIsRegenerating(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto grid flex-1 gap-12 md:grid-cols-[3fr_2fr] p-4 md:p-8">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Profile Generator
              </h1>
              <p className="text-muted-foreground">
                Upload your resume or fill out the fields to generate your professional profile.
              </p>
            </div>
            <ProfileForm 
              profile={profile} 
              setProfile={setProfile} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
          <div className="hidden md:block">
            <div className="sticky top-8 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Live Preview
                </h2>
                <p className="text-muted-foreground">
                  See what your new profile looks like in real-time.
                </p>
              </div>
              <ProfilePreview profile={profile} onRegenerate={handleRegenerateProfile} isRegenerating={isRegenerating} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
