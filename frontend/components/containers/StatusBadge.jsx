import { CheckCircle, Clock, Trash2 } from "lucide-react";

export default function StatusBadge({ status }) {
    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        in_progress: { color: 'bg-blue-100 text-blue-800', icon: Trash2 },
        completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        verified: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
    };

    // Provide fallback configuration if status is not defined in statusConfig
    const { color, icon: Icon } = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    const displayStatus = status ? status.replace('_', ' ') : 'Unknown';

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}>
            <Icon className="mr-1 h-3 w-3" />
            {displayStatus}
        </span>
    );
}
