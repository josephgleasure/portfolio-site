import React, { useEffect, useState } from 'react';

interface FiltersProps {
  tags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ tags, selected, onToggle }) => {
	// Remember any filter that has ever been clicked
	const [visited, setVisited] = useState<Set<string>>(new Set());

	useEffect(() => {
		try {
			const raw = localStorage.getItem('visitedFilters');
			if (raw) {
				const arr: string[] = JSON.parse(raw);
				setVisited(new Set(arr));
			}
		} catch {
			// ignore storage errors
		}
	}, []);

	const handleClick = (tag: string) => {
		onToggle(tag);
		setVisited(prev => {
			if (prev.has(tag)) return prev;
			const next = new Set(prev);
			next.add(tag);
			try {
				localStorage.setItem('visitedFilters', JSON.stringify(Array.from(next)));
			} catch {
				// ignore storage errors
			}
			return next;
		});
	};

	if (!tags || tags.length === 0) return null;
	return (
		<div className="filter-section">
			{tags.map((tag) => {
				const isActive = selected.has(tag);
				const isVisited = visited.has(tag);
				return (
					<button
						key={tag}
						className={`filter-button${isActive ? ' active' : ''}${isVisited ? ' visited' : ''}`}
						onClick={() => handleClick(tag)}
            type="button"
					>
						{tag}
					</button>
				);
			})}
		</div>
	);
};

export default Filters;


