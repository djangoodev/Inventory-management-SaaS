import React, { Component } from 'react';
import {Button, Icon, Input, Table, Skeleton} from "antd";
import Highlighter from 'react-highlight-words';


class TableComponent extends Component{
  static self;
  constructor(props) {
    super(props);
    TableComponent.self = this;
    this.state = {
      data: props.data,
      searchText: '',
      columns: props.columns
    }
    // this.addSearchProps(props.columns);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.data !== this.props.data) {
      this.setState({
        data: this.props.data
      })
    }
  }

  addSearchProps(data) {
    let length = data.length;
    for (let i=0; i < length-1; i++) {
      let new_columns = {
        ...this.state.columns[i],
        ...this.getColumnSearchProps(this.state.columns[i].dataIndex)
      }
      this.state.columns[i] = new_columns
    }
  }


  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    return(
      <div>
      {
        this.state.data
        ?
          <Table columns={this.state.columns} dataSource={this.state.data} pagination={{pageSize: 15}}/>
        :
          <Skeleton loading={true} active title paragraph={{ rows: 20}}/>
      }
      </div>
    )
  }
}

export default TableComponent
