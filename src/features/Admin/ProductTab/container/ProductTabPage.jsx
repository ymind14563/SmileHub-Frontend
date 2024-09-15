import React, { useEffect, useState } from 'react';
import ProductSearchForm from '../components/ProductSearchForm';
import ProductList from '../components/ProductList';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '../store/productTabSlice';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ProductTabPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productTab.products);
  const [initialProducts, setInitialProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [includeSoldOut, setIncludeSoldOut] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/product/list?page=${currentPage}&limit=99`,
        );

        const fetchedProducts = response.data.productInfo.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          seller: product.nickname || product.seller,
          createdAt: product.createdAt,
          status: product.status,
          reports: product.reportCount,
        }));

        setInitialProducts(fetchedProducts); // 필터링되지 않은 초기 상품 목록 저장
        setSearchResults(fetchedProducts); // 검색 결과에도 초기값 설정
        dispatch(setProducts(fetchedProducts)); // Redux 상태 설정
      } catch (error) {
        console.error('상품 목록 불러오는 중 오류 발생', error);
      }
    };

    fetchProducts();
  }, [currentPage, dispatch]);

  // 검색 기능
  const handleSearch = ({ searchType, value }) => {
    const filtered = initialProducts.filter((product) => {
      const matchSearch =
        searchType === 'name'
          ? product.productName.includes(value)
          : product.seller.includes(value);
      return matchSearch;
    });
    setSearchResults(filtered); // 검색 결과를 별도 상태로 저장
    dispatch(setProducts(filtered)); // Redux 상태로 검색된 결과 설정
  };

  // 체크박스 클릭 시 검색된 결과에서 필터링
  const handleStatusChange = (checked) => {
    setIncludeSoldOut(checked);

    // 검색 결과(searchResults)를 기준으로 필터링
    const filtered = searchResults.filter((product) => {
      return checked || product.status === '판매중';
    });
    dispatch(setProducts(filtered));
  };

  // 초기화
  const handleReset = () => {
    setSearchType('');
    setSearchValue('');
    setSearchResults(initialProducts);
    dispatch(setProducts(initialProducts));
  };

  return (
    <div>
      <ProductSearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        onStatusChange={handleStatusChange}
      />

      <ProductList
        searchResults={products}
        setSearchResults={(newResults) => dispatch(setProducts(newResults))}
      />
    </div>
  );
};

export default ProductTabPage;
