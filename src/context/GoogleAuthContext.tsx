import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  setCachedAccessToken
} from '../services/googleAuth';
import {
  createExamSpreadsheet,
  listDriveSpreadsheets,
  importQuestionsFromSpreadsheet,
  DriveSpreadsheetFile
} from '../services/googleSheets';
import { GeneratedExam, QuestionItem } from '../types';

interface GoogleAuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoadingAuth: boolean;
  isConnected: boolean;
  signIn: () => Promise<string | null>;
  signOut: () => Promise<void>;
  isSheetsModalOpen: boolean;
  setIsSheetsModalOpen: (open: boolean) => void;
  // Sheets Operations
  exportExamToSheets: (exam: GeneratedExam) => Promise<{ spreadsheetUrl: string; spreadsheetId: string }>;
  importExamFromSheets: (spreadsheetId: string) => Promise<QuestionItem[]>;
  driveFiles: DriveSpreadsheetFile[];
  fetchDriveFiles: () => Promise<void>;
  isLoadingDrive: boolean;
  lastExportedUrl: string | null;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveSpreadsheetFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [lastExportedUrl, setLastExportedUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setAccessTokenState(token);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setAccessTokenState(null);
        setIsLoadingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<string | null> => {
    try {
      setIsLoadingAuth(true);
      const res = await googleSignIn();
      setUser(res.user);
      setAccessTokenState(res.accessToken);
      setCachedAccessToken(res.accessToken);
      return res.accessToken;
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signOut = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessTokenState(null);
    setDriveFiles([]);
  };

  const fetchDriveFiles = async () => {
    let token = accessToken || (await getAccessToken());
    if (!token) {
      token = await signIn();
    }
    if (!token) return;

    try {
      setIsLoadingDrive(true);
      const files = await listDriveSpreadsheets(token);
      setDriveFiles(files);
    } catch (e) {
      console.error('Failed to fetch Drive spreadsheets:', e);
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const exportExamToSheets = async (
    exam: GeneratedExam
  ): Promise<{ spreadsheetUrl: string; spreadsheetId: string }> => {
    let token = accessToken || (await getAccessToken());
    if (!token) {
      token = await signIn();
    }
    if (!token) {
      throw new Error('Akses Google Sheets memerlukan login dengan Akun Google.');
    }

    const result = await createExamSpreadsheet(token, exam);
    setLastExportedUrl(result.spreadsheetUrl);
    // Refresh drive list in background
    fetchDriveFiles().catch(() => {});
    return result;
  };

  const importExamFromSheets = async (spreadsheetId: string): Promise<QuestionItem[]> => {
    let token = accessToken || (await getAccessToken());
    if (!token) {
      token = await signIn();
    }
    if (!token) {
      throw new Error('Akses Google Sheets memerlukan login dengan Akun Google.');
    }

    return await importQuestionsFromSpreadsheet(token, spreadsheetId);
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        accessToken,
        isLoadingAuth,
        isConnected: !!user && !!accessToken,
        signIn,
        signOut,
        isSheetsModalOpen,
        setIsSheetsModalOpen,
        exportExamToSheets,
        importExamFromSheets,
        driveFiles,
        fetchDriveFiles,
        isLoadingDrive,
        lastExportedUrl,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const ctx = useContext(GoogleAuthContext);
  if (!ctx) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return ctx;
};
