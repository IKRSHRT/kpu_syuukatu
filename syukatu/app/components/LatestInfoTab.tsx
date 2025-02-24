// /components/LatestInfoTab.tsx
import Link from 'next/link';

interface Entry {
  id: string;
  company_name: string;
  [key: string]: any;
  created_at: string;
  users_syukatu?: {
    id: string;
    name: string;
    department: string;
  };
}

interface LatestInfoTabProps {
  title: string;
  entries: Entry[];
  registerPath: string;
  viewPath: string;
  isEmpty: boolean;
  emptyMessage: string;
  fieldToShow: string;
  hideUserProfile?: boolean;
}

const LatestInfoTab: React.FC<LatestInfoTabProps> = ({
  title,
  entries,
  registerPath,
  viewPath,
  isEmpty,
  emptyMessage,
  fieldToShow,
  hideUserProfile = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="latest-content">
      <div className="latest-header">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={registerPath} className="dashboard-add-button flex items-center">
          <svg className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          新規登録
        </Link>
      </div>

      {isEmpty ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="latest-items grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(entry => (
            <Link key={entry.id} href={`${viewPath}/${entry.id}`} className="latest-item">
              <div className="latest-info">
                <h3 className="text-lg font-medium">{entry.company_name}</h3>
                <p className="text-sm text-gray-600">{entry[fieldToShow]}</p>
                {!hideUserProfile && entry.users_syukatu && (
                  <div className="mt-1 text-xs text-gray-500">
                    投稿者: {entry.users_syukatu.name}（{entry.users_syukatu.department}）
                    <Link href={`/user/${entry.users_syukatu.id}`} className="text-teal-600 ml-2 underline">
                      投稿者のプロフィールを見る
                    </Link>
                  </div>
                )}
              </div>
              <div className="latest-date">
                {formatDate(entry.created_at)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isEmpty && (
        <div className="mt-6 text-center">
          <Link href={viewPath} className="text-teal-600 font-medium hover:text-teal-800 transition-colors">
            すべて見る →
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestInfoTab;