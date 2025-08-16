import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Briefcase, GraduationCap, Mail, Phone, User, Star, Linkedin } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { CopyButton } from './copy-button';

interface ProfilePreviewProps {
  profile: Profile;
}

const Section = ({ title, icon, content, textToCopy, isSkills = false }: { title: string, icon: React.ReactNode, content: React.ReactNode, textToCopy: string, isSkills?: boolean }) => (
  <section>
    <div className="flex items-start justify-between">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        {icon} {title}
      </CardTitle>
      <CopyButton textToCopy={textToCopy} />
    </div>
    <div className={`mt-3 pl-[36px] ${isSkills ? 'flex flex-wrap gap-2' : 'whitespace-pre-wrap text-sm text-muted-foreground'}`}>
      {content}
    </div>
  </section>
);


export function ProfilePreview({ profile }: ProfilePreviewProps) {
  const formatText = (text: string) => {
    return text.split('\n').map((line, index, arr) => (
      <span key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </span>
    ));
  };
  
  const contactParts = profile.contactDetails.split('|').map(p => p.trim());

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="relative h-28 bg-muted">
        <Image
          src="https://placehold.co/800x200.png"
          alt="Profile Banner"
          data-ai-hint="abstract banner"
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6 pt-0">
        <div className="relative -mt-14">
          <div className="h-28 w-28 rounded-full border-4 border-card bg-card overflow-hidden">
            <Image
              src="https://placehold.co/128x128.png"
              alt={profile.name}
              data-ai-hint="professional headshot"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
          </div>
        </div>
        
        <div className="mt-4">
            <h2 className="text-2xl font-bold">{profile.name || 'Your Name'}</h2>
            <p className="text-md text-muted-foreground">{profile.headline || 'Your Headline'}</p>
        </div>

        <div className="mt-2 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
            {contactParts[0] && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {contactParts[0]}</span>}
            {contactParts[1] && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {contactParts[1]}</span>}
            {contactParts[2] && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> {contactParts[2]}</span>}
        </div>

        <Separator className="my-6" />

        <div className="space-y-8">
          {profile.summary && (
            <Section 
              title="About"
              icon={<User className="text-primary"/>}
              content={formatText(profile.summary)}
              textToCopy={profile.summary}
            />
          )}

          {profile.workExperience && (
            <Section 
              title="Experience"
              icon={<Briefcase className="text-primary"/>}
              content={formatText(profile.workExperience)}
              textToCopy={profile.workExperience}
            />
          )}
          
          {profile.education && (
             <Section 
              title="Education"
              icon={<GraduationCap className="text-primary"/>}
              content={formatText(profile.education)}
              textToCopy={profile.education}
            />
          )}
         
          {profile.skills.length > 0 && (
            <Section
              title="Skills"
              icon={<Star className="text-primary"/>}
              content={profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
              ))}
              textToCopy={profile.skills.join(', ')}
              isSkills
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
