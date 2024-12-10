import { useState, useEffect } from 'react';

export function UserDashboard({ userId }) {
    const [reward, setReward] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userReward = await getOrCreateReward(userId);
            setReward(userReward);

            const userNotifications = await getUnreadNotifications(userId);
            setNotifications(userNotifications);
        };

        fetchUserData();
    }, [userId]);

    const handleNotificationRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        setNotifications(notifications.filter(n => n.id !== notificationId));
    };

    return (
        <div>
            <h2>User Dashboard</h2>
            {reward && (
                <div>
                    <p>Points: {reward.points}</p>
                    <p>Level: {reward.level}</p>
                </div>
            )}
            <h3>Notifications</h3>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        {notification.message}
                        <button onClick={() => handleNotificationRead(notification.id)}>Mark as Read</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
