import s from '../../styles/components/screens.module.css';

export default function TitleScreen({ onNavigate }) {
  return (
    <div className={s.titleScreen}>
      <div className={s.titleMain}>CELLFACTORY</div>
      <div className={s.titleSub}>G E N E S I S</div>
      <div className={s.titleEra}>🌋 纪元一：化学黎明</div>
      <div className={s.titleDesc}>
        38亿年前，深海热泉口。<br/>
        你周围只有CO₂、H₂、H₂O和矿物质。<br/>
        从无机物中，合成第一个有机分子——<br/>
        这是生命的第一步。
      </div>
      <button className={s.btnStart} onClick={() => onNavigate('levels')}>
        开始起源
      </button>
      <button className={s.btnDataView} onClick={() => onNavigate('dataview')}>
        🧪 数据库查看器
      </button>
    </div>
  );
}
