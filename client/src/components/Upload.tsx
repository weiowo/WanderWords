import { IKContext, IKUpload } from 'imagekitio-react';
import { useRef, ReactNode } from 'react';
import { toast } from 'react-toastify';

// Define the expected structure for the response from the authenticator function
interface AuthenticatorResponse {
  signature: string;
  expire: string;
  token: string;
}

// Define the props for the Upload component
interface UploadProps {
  children: ReactNode;
  type: string;
  setProgress: (progress: number) => void;
  setData: (data: unknown) => void;
}

const authenticator = async (): Promise<AuthenticatorResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/upload-auth`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error('Authentication request failed: Unknown error');
    }
  }
};

const Upload = ({ children, type, setProgress, setData }: UploadProps) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const onError = (err: any) => {
    console.log(err);
    toast.error('Image upload failed!');
  };

  const onSuccess = (res: unknown) => {
    console.log(res);
    setData(res);
  };
  const onUploadProgress = (progress: { loaded: number; total: number }) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IK_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current?.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
