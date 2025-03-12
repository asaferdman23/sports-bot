export function GameStats({ stats }) {
    return (
      <div className="p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Game Stats</h2>
        <table className="w-full text-left">
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>
                <td className="font-medium">{stat.metric}</td>
                <td>{stat.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }