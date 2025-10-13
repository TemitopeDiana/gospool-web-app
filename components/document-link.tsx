import SvgIcon from './svg-icon';

const fileNameFromUrl = (url: string | undefined) => {
  try {
    return decodeURIComponent(url?.split('/').pop() || 'file');
  } catch {
    return url;
  }
};

const DocumentLink = ({ url, label }: { url?: string; label?: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-1 items-center text-primary-500 ml-auto justify-end"
      aria-label={`Open ${label ?? fileNameFromUrl(url)} in new tab`}
    >
      <SvgIcon name="document-text" className="w-4 h-4" />

      <p className="underline">{fileNameFromUrl(url)}</p>
    </a>
  );
};

export default DocumentLink;
