'use client';

import { useState, useRef, useEffect } from 'react';
import type { Profile } from '@/lib/types';
import { parseResume } from '@/ai/flows/parse-resume';
import { enhanceProfile } from '@/ai/flows/enhance-profile';
import { suggestSkills } from '@/ai/flows/suggest-skills';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, Wand2, Sparkles, X, FileCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import type { ParseResumeOutput } from '@/ai/flows/parse-resume';

interface ProfileFormProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProfileForm({ profile, setProfile, isLoading, setIsLoading }: ProfileFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('resume');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [enhancementTarget, setEnhancementTarget] = useState<'summary' | 'workExperience' | null>(null);

  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParseResumeOutput | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isParsing) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isParsing]);

  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setParsedData(null);
    setIsParsing(true);
    setProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dataUri = e.target?.result as string;
          const result = await parseResume({ resumeDataUri: dataUri });
          setParsedData(result);
          setProgress(100);
          toast({ title: 'Resume Ready!', description: 'Click "Generate Profile" to continue.' });
        } catch (innerError) {
           console.error('Error parsing resume:', innerError);
           toast({ variant: 'destructive', title: 'Parsing Error', description: 'Could not extract information from the resume. Please try another file or manual entry.' });
           setUploadedFile(null);
        } finally {
          setIsParsing(false);
        }
      };
      reader.onerror = () => {
        setIsParsing(false);
        setUploadedFile(null);
        toast({ variant: 'destructive', title: 'File Error', description: 'Could not read the selected file.' });
      }
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
      setIsParsing(false);
      setUploadedFile(null);
    } finally {
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateProfile = () => {
    if (!parsedData) return;
    
    setProfile(prev => ({
      ...prev,
      name: parsedData.name || prev.name,
      contactDetails: parsedData.contactDetails || prev.contactDetails,
      workExperience: parsedData.workExperience || prev.workExperience,
      education: parsedData.education || prev.education,
      skills: parsedData.skills ? parsedData.skills.split(/, ?|\n/).filter(Boolean) : prev.skills,
    }));
    
    setActiveTab('manual');
    toast({ title: 'Profile Generated!', description: 'Your profile has been populated. Review and edit below.' });
    setUploadedFile(null);
    setParsedData(null);
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEnhanceClick = async (field: 'summary' | 'workExperience') => {
    setEnhancementTarget(field);
    const content = profile[field];
    if (!content.trim()) {
      toast({ variant: 'destructive', title: 'Empty Content', description: 'Cannot enhance an empty field.' });
      return;
    }
    setOriginalContent(content);
    setIsEnhancing(true);
    try {
      const result = await enhanceProfile({ profileData: content });
      setEnhancedContent(result.enhancedProfile);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to enhance content.' });
      setEnhancedContent('Could not enhance content.');
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const acceptEnhancement = () => {
    if (enhancementTarget) {
      setProfile(prev => ({ ...prev, [enhancementTarget]: enhancedContent }));
      toast({ title: 'Content Enhanced', description: `Your ${enhancementTarget === 'summary' ? 'summary' : 'work experience'} has been updated.` });
    }
    closeEnhancementDialog();
  };

  const closeEnhancementDialog = () => {
    setEnhancementTarget(null);
    setOriginalContent('');
    setEnhancedContent('');
  };

  const handleSuggestSkills = async () => {
    if (!profile.workExperience.trim() || !profile.industry.trim()) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide work experience and a target industry to get skill suggestions.' });
      return;
    }
    setIsSuggestingSkills(true);
    try {
      const result = await suggestSkills({ workHistory: profile.workExperience, industry: profile.industry });
      setSuggestedSkillsList(result.suggestedSkills.filter(s => !profile.skills.includes(s)));
      if (result.suggestedSkills.length > 0) {
        toast({ title: 'Skills Suggested!', description: 'Review the suggested skills below.' });
      } else {
        toast({ title: 'No New Skills', description: 'No new skill suggestions at this time.' });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to suggest skills.' });
    } finally {
      setIsSuggestingSkills(false);
    }
  }

  const addSkill = (skill: string) => {
    if (!profile.skills.find(s => s.toLowerCase() === skill.toLowerCase())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSuggestedSkillsList(prev => prev.filter(s => s !== skill));
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">1. Upload Resume</TabsTrigger>
            <TabsTrigger value="manual">2. Edit Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="resume" className="mt-6">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-full">
              {!uploadedFile && (
                <>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Upload your resume</h3>
                  <p className="mt-2 text-sm text-muted-foreground">PDFs and text-based documents work best.</p>
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isParsing} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                  </Button>
                </>
              )}
              {uploadedFile && (
                <div className="w-full flex flex-col items-center">
                  <FileCheck className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 text-lg font-medium">{uploadedFile.name}</h3>
                   {isParsing ? (
                    <div className="w-full max-w-sm mt-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Extracting information...</p>
                        <Progress value={progress} className="w-full" />
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-muted-foreground">Resume uploaded and ready to be parsed.</p>
                      <Button onClick={handleGenerateProfile} disabled={isParsing || !parsedData} className="mt-6">
                        {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        {isParsing ? 'Parsing...' : 'Generate Profile'}
                      </Button>
                    </>
                  )}
                </div>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
            </div>
          </TabsContent>
          <TabsContent value="manual" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contactDetails">Contact Details</Label>
                <Input id="contactDetails" name="contactDetails" value={profile.contactDetails} onChange={handleInputChange} placeholder="email | phone | linkedin" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" name="headline" value={profile.headline} onChange={handleInputChange} placeholder="e.g. Software Engineer at Tech Corp" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="summary">About / Summary</Label>
                <Button variant="outline" size="sm" onClick={() => handleEnhanceClick('summary')} disabled={!profile.summary}>
                  <Wand2 className="mr-2 h-4 w-4 text-accent" /> Enhance with AI
                </Button>
              </div>
              <Textarea id="summary" name="summary" value={profile.summary} onChange={handleInputChange} rows={6} placeholder="Write a brief summary about yourself." />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="workExperience">Work Experience</Label>
                 <Button variant="outline" size="sm" onClick={() => handleEnhanceClick('workExperience')} disabled={!profile.workExperience}>
                   <Wand2 className="mr-2 h-4 w-4 text-accent" /> Enhance with AI
                </Button>
              </div>
              <Textarea id="workExperience" name="workExperience" value={profile.workExperience} onChange={handleInputChange} rows={10} placeholder="Detail your work experience, one position per entry." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea id="education" name="education" value={profile.education} onChange={handleInputChange} rows={4} placeholder="Your educational background." />
            </div>
            <div className="space-y-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Target Industry</Label>
                <Input id="industry" name="industry" value={profile.industry} onChange={handleInputChange} placeholder="e.g. Information Technology and Services" />
                 <p className="text-xs text-muted-foreground">Used for generating relevant skill suggestions.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Skills</Label>
                  <Button variant="outline" size="sm" onClick={handleSuggestSkills} disabled={isSuggestingSkills || !profile.workExperience}>
                    {isSuggestingSkills ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                    Suggest Skills
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 rounded-md border min-h-[40px] p-2">
                  {profile.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="pl-2 pr-1 text-sm">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/20 text-destructive-foreground hover:text-destructive">
                         <span className="sr-only">Remove {skill}</span>
                         <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {profile.skills.length === 0 && <p className="text-sm text-muted-foreground self-center">Add skills or use the skill suggester.</p>}
                </div>
              </div>
              
              {suggestedSkillsList.length > 0 && (
                <div className="space-y-2">
                  <Label>AI-Suggested Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkillsList.map(skill => (
                      <button key={skill} onClick={() => addSkill(skill)} aria-label={`Add skill ${skill}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent/20 hover:border-accent text-base">
                          + {skill}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={!!enhancementTarget} onOpenChange={(open) => !open && closeEnhancementDialog()}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI Enhancement Suggestion</DialogTitle>
              <DialogDescription>
                Review the AI suggestions for your profile section. You can accept the changes or close this window to keep the original.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1 -mx-1">
              <div>
                <Label>Your Original Text</Label>
                <Card className="mt-2 p-4 text-sm min-h-[200px] whitespace-pre-wrap bg-muted/50">{originalContent}</Card>
              </div>
              <div>
                <Label className="text-primary flex items-center gap-1"><Wand2 className="h-4 w-4" /> AI-Enhanced Version</Label>
                 <Card className="mt-2 p-4 text-sm min-h-[200px] whitespace-pre-wrap border-primary/50 ring-1 ring-primary/50">
                  {isEnhancing ? <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : enhancedContent}
                </Card>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={acceptEnhancement} disabled={isEnhancing || !enhancedContent}>
                Accept & Use This Text
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
