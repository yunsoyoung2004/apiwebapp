import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('馬'); // 기본 키워드 설정
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(
            'http://db.itkc.or.kr/openapi/search?q=query†' +
              keyword +
              '$opDir†ITKC_GO_1422A&page=' +
              page
          )}`
        );

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'application/xml');

        const parsedData = [];
        const docs = xmlDoc.getElementsByTagName('doc');

        for (let i = 0; i < docs.length; i++) {
          const doc = docs[i];
          const publicationYear = doc.querySelector('field[name="간행년"]')?.textContent.trim();
          const articleTitle = doc.querySelector('field[name="기사명"]')?.textContent.trim();
          const genreName = doc.querySelector('field[name="문체명"]')?.textContent.trim();
          const dci_s = doc.querySelector('field[name="DCI_s"]')?.textContent.trim();

          if (publicationYear && articleTitle && genreName && dci_s) {
            parsedData.push({
              publicationYear,
              articleTitle,
              genreName,
              dci_s,
              xmlData: new XMLSerializer().serializeToString(doc),
            });
          }
        }

        setData((prevData) => (page === 1 ? parsedData : [...prevData, ...parsedData]));
        setTotalPages(5); // API에서 총 페이지를 반환하지 않으므로 임의 설정
      } catch (err) {
        setError('API 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, page]);

  const handleSaveXML = (xmlData) => {
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `xml_data.xml`;
    link.click();
  };

  const handleDCILink = (dci_s) => {
    // DCI_s에서 뒤에 _2004_006 또는 _2004_006_XML 부분을 제거
    const cleanedDCI = dci_s.replace(/_2004_\d{3}_XML$/, '').replace(/_2004_\d{3}$/, '');
    const link = `https://db.itkc.or.kr/dir/item?itemId=GO#dir/node?dataId=${cleanedDCI}&viewSync=TR`;
    window.open(link, '_blank');
  };

  const groupByGenre = (data) => {
    return data.reduce((acc, item) => {
      const genre = item.genreName;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByGenre(data);
  const recommendedKeywords = {
    행동: ['馬', '至', '自', '見', '入', '登', '觀', '抵', '聲', '到', '舞', '宿', '回', '得', '過', '作', '關', '進', '歷', '渡', '絶', '來', '出', '樂', '于', '流', '坐', '知', '飯', '歸', '起', '騎', '成', '能', '望', '還', '會', '立', '蓋', '往', '步', '勝', '開', '許', '連', '移', '產', '宣', '待', '將', '復', '送', '傳', '統', '應', '付', '解', '落', '換', '駈', '借', '留', '張', '中火', '朝發', '飯後', '出門', '問', '渡江', '來謁', '蒙人', '行', '寒食', '意', '從', '看', '梯', '經', '稱'],
    상태: ['相', '如', '有', '中', '餘', '可', '小', '皆', '與', '安', '高', '未', '邊', '間', '淸', '和', '殘', '無', '恶', '長', '非', '際', '常', '大', '奇'],
    자연물: ['山', '日', '城', '風', '嶺', '鳳', '石', '水', '月', '河', '木', '竹', '花', '林', '草', '鳥'],
    인공물: ['家', '門', '里', '所', '店', '亭', '館', '境', '塔', '庭', '坊', '衙', '寺', '會', '省', '業', '碑'],
    숫자: ['二', '十', '三', '五', '四', '百', '七', '二十', '六十', '十餘', '四十', '數', '萬'],
    위치: ['前', '後', '上', '下', '東', '西', '南', '北', '左', '右', '之間', '上有', '里許'],
    시간: ['午', '書', '朝', '夜', '晩晴', '時', '今', '早', '晝'],
    날씨: ['晴', '雪', '寒', '風甚', '雨', '霧'],
    물건: ['劍', '衣', '角', '子', '紙', '金', '畫', '玉', '茶', '唐', '令', '盤', '書', '戴', '字'],
    교유: ['客', '詩', '員', '社', '朋友'],
  };

  return (
    <div className="app">
      <h1>김정중의 연행록</h1>

      <div className="search-bar">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button
          onClick={() => {
            setData([]);  // 검색 시 데이터 초기화
            setPage(1);   // 페이지 1로 초기화
          }}
        >
          검색
        </button>
      </div>

      <h3>추천 키워드</h3>
      {Object.keys(recommendedKeywords).map((category) => (
        <div key={category} className="keyword-category">
          <h4>{category}</h4>
          <div className="keyword-list">
            {recommendedKeywords[category].map((keywordItem, index) => (
              <button
                key={index}
                className="keyword-btn"
                onClick={() => {
                  setKeyword(keywordItem);
                  setData([]);  // 새로운 키워드로 검색 시 데이터 초기화
                  setPage(1);   // 페이지 1로 초기화
                }}
              >
                {keywordItem}
              </button>
            ))}
          </div>
        </div>
      ))}

      {loading && <p>로딩 중...</p>}
      {error && <p className="error">{error}</p>}

      {Object.keys(groupedData).length > 0 && (
        <div className="results">
          <h2>검색 결과</h2>
          {Object.keys(groupedData).map((genre) => (
            <div className="genre-group" key={genre}>
              <h3>{genre}</h3>
              {groupedData[genre].map((item, index) => (
                <div key={index} className="result-item">
                  <p>발행년도: {item.publicationYear}</p>
                  <p>기사명: {item.articleTitle}</p>
                  <button onClick={() => handleSaveXML(item.xmlData)}>XML 저장</button>
                  <button onClick={() => handleDCILink(item.dci_s)}>DCI 링크</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            이전
          </button>
          <span>{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
