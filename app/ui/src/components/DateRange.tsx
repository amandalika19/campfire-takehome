interface Props {
    start: string;
    end: string;
    setStart: (date: string) => void;
    setEnd: (date: string) => void;
    onShow: () => void;
  }
  
  export default function DateRange({ start, end, setStart, setEnd, onShow }: Props) {
    return (
      <div>
        <label>
          Start <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          End <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <button onClick={onShow}>Show statement</button>
      </div>
    );
  }